
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TutorSearch from "@/components/tutor/TutorSearch";
import TutorGrid from "@/components/tutor/TutorGrid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Session type definition
interface Session {
  id: string;
  tutor_name: string;
  subject: string;
  scheduled_at: string;
  status: string;
  price_per_hour: number;
  location: string;
  payment_option?: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchFilters, setSearchFilters] = useState<{
    subject?: string;
    gradeLevel?: string;
    location?: string;
    maxPrice?: number;
  }>({});

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
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

  // Fetch sessions for the current student
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['studentSessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First, fetch sessions with tutor_id
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          id, 
          subject, 
          scheduled_at, 
          status, 
          price_per_hour, 
          location, 
          payment_option,
          tutor_id
        `)
        .eq('student_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        throw new Error("Failed to fetch sessions");
      }

      // Now for each session, fetch the tutor's profile data
      const sessionsWithTutorNames = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: tutorData, error: tutorError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.tutor_id)
            .single();

          if (tutorError) {
            console.error("Error fetching tutor profile:", tutorError);
            return {
              ...session,
              tutor_name: 'Unknown Tutor'
            };
          }

          return {
            ...session,
            tutor_name: `${tutorData.first_name || ''} ${tutorData.last_name || ''}`.trim() || 'Unknown Tutor'
          };
        })
      );

      return sessionsWithTutorNames as Session[];
    },
    enabled: !!user,
  });

  // Determine upcoming and past sessions
  const now = new Date();
  const upcomingSessions = sessions.filter(
    session => new Date(session.scheduled_at) >= now
  );
  const pastSessions = sessions.filter(
    session => new Date(session.scheduled_at) < now
  );

  // Function to update payment option
  const handlePaymentOptionChange = async (sessionId: string, paymentOption: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ payment_option: paymentOption })
        .eq('id', sessionId)
        .eq('student_id', user?.id); // Security check
      
      if (error) throw error;
      
      toast({
        title: "Payment option updated",
        description: `You've selected to pay ${paymentOption} for this session.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating payment option:", error);
      toast({
        title: "Update failed",
        description: "Could not update payment option",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="search">Find a Tutor</TabsTrigger>
            <TabsTrigger value="sessions">Session History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Search Tutors</h2>
              <TutorSearch onSearch={handleSearch} showPriceFilter={true} />
              
              <div className="mt-6">
                <TutorGrid filters={searchFilters} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
              {isLoadingSessions ? (
                <div className="py-10 text-center">Loading sessions...</div>
              ) : upcomingSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.tutor_name}</TableCell>
                        <TableCell>{session.subject}</TableCell>
                        <TableCell>
                          {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                          {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>{session.location || 'Online'}</TableCell>
                        <TableCell>${session.price_per_hour}/hr</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            session.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {session.status === 'accepted' && !session.payment_option ? (
                            <div className="flex flex-col space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handlePaymentOptionChange(session.id, '50% upfront')}
                              >
                                Pay 50% now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handlePaymentOptionChange(session.id, '100% upfront')}
                              >
                                Pay 100% now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handlePaymentOptionChange(session.id, '1/3 upfront')}
                              >
                                Pay 1/3 now
                              </Button>
                            </div>
                          ) : (
                            <span>{session.payment_option || '-'}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 py-4">No upcoming sessions found.</p>
              )}
              
              <h2 className="text-xl font-semibold mb-4 mt-8">Past Sessions</h2>
              {isLoadingSessions ? (
                <div className="py-10 text-center">Loading sessions...</div>
              ) : pastSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.tutor_name}</TableCell>
                        <TableCell>{session.subject}</TableCell>
                        <TableCell>
                          {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                          {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>{session.location || 'Online'}</TableCell>
                        <TableCell>${session.price_per_hour}/hr</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 py-4">No past sessions found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
