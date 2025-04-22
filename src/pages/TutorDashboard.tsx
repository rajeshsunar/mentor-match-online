
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultipleSelect, MultipleSelectItem } from "@/components/ui/multiple-select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

const portfolioSchema = z.object({
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  experience: z.string().optional(),
  hourlyRate: z.coerce.number().min(10, "Hourly rate must be at least $10"),
  location: z.string().min(2, "Location is required"),
  availabilityStart: z.string(),
  availabilityEnd: z.string(),
});

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");

  const subjects = [
    "Mathematics", "Science", "English", "History", 
    "Programming", "Physics", "Chemistry", "Biology",
    "Economics", "Foreign Languages", "Art", "Music"
  ];

  // Fetch existing portfolio
  const { 
    data: portfolio, 
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio
  } = useQuery({
    queryKey: ['tutorPortfolio', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('tutor_portfolios')
        .select('*')
        .eq('tutor_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error("Error fetching portfolio:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Fetch session requests
  const { 
    data: sessionRequests = [], 
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['tutorRequests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First, fetch sessions with student_id
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          id, 
          subject,
          grade_level,
          scheduled_at, 
          status, 
          price_per_hour,
          location,
          student_id
        `)
        .eq('tutor_id', user.id)
        .order('scheduled_at', { ascending: false });
      
      if (sessionsError) {
        console.error("Error fetching session requests:", sessionsError);
        throw sessionsError;
      }
      
      // Now for each session, fetch the student's profile data
      const sessionsWithStudentNames = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: studentData, error: studentError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.student_id)
            .single();

          if (studentError) {
            console.error("Error fetching student profile:", studentError);
            return {
              ...session,
              student_name: 'Unknown Student'
            };
          }

          return {
            ...session,
            student_name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim() || 'Unknown Student'
          };
        })
      );
      
      return sessionsWithStudentNames;
    },
    enabled: !!user,
  });

  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      subjects: [],
      experience: "",
      hourlyRate: undefined,
      location: "",
      availabilityStart: "09:00",
      availabilityEnd: "17:00",
    }
  });

  // Update form with existing portfolio data when loaded
  useEffect(() => {
    if (portfolio) {
      form.reset({
        subjects: portfolio.subjects || [],
        experience: portfolio.experience || "",
        hourlyRate: portfolio.hourly_rate || undefined,
        location: portfolio.location || "",
        availabilityStart: portfolio.availability_start || "09:00",
        availabilityEnd: portfolio.availability_end || "17:00",
      });
    }
  }, [portfolio, form]);

  const onSubmit = async (values: z.infer<typeof portfolioSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your portfolio.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tutor_portfolios')
        .upsert({
          tutor_id: user.id,
          subjects: values.subjects,
          experience: values.experience,
          hourly_rate: values.hourlyRate,
          location: values.location,
          availability_start: values.availabilityStart,
          availability_end: values.availabilityEnd,
        });

      if (error) throw error;

      toast({
        title: portfolio ? "Portfolio Updated" : "Portfolio Created",
        description: "Your tutor portfolio has been successfully saved.",
      });
      
      // Refresh portfolio data
      refetchPortfolio();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update portfolio. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionStatusChange = async (sessionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', sessionId)
        .eq('tutor_id', user?.id); // Security check
      
      if (error) throw error;
      
      toast({
        title: "Session updated",
        description: `Session status changed to ${newStatus}`,
        duration: 3000,
      });
      
      // Refresh requests
      refetchRequests();
    } catch (error) {
      console.error("Error updating session status:", error);
      toast({
        title: "Update failed",
        description: "Could not update session status",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoadingPortfolio) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="requests">Session Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{portfolio ? "Edit Your Portfolio" : "Create Your Portfolio"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects You Can Teach</FormLabel>
                          <FormControl>
                            <MultipleSelect
                              placeholder="Select subjects"
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              {subjects.map((subject) => (
                                <MultipleSelectItem key={subject} value={subject}>
                                  {subject}
                                </MultipleSelectItem>
                              ))}
                            </MultipleSelect>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="City, State" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teaching Experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your teaching experience" 
                              {...field} 
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="availabilityStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability Start</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availabilityEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability End</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Saving..." : (portfolio ? "Update Portfolio" : "Create Portfolio")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Session Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="py-10 text-center">Loading session requests...</div>
                ) : sessionRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sessionRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{request.student_name}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{request.subject}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{request.grade_level || '-'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(request.scheduled_at).toLocaleDateString()} at{' '}
                              {new Date(request.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{request.location || 'Online'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">${request.price_per_hour}/hr</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                request.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap space-x-2">
                              {request.status === 'requested' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleSessionStatusChange(request.id, 'accepted')}
                                    className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleSessionStatusChange(request.id, 'rejected')}
                                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {request.status === 'accepted' && new Date(request.scheduled_at) < new Date() && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleSessionStatusChange(request.id, 'completed')}
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-gray-500">You don't have any session requests yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default TutorDashboard;
