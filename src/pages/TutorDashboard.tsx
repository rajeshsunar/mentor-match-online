
import { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const portfolioSchema = z.object({
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  experience: z.string().optional(),
  hourlyRate: z.coerce.number().min(10, "Hourly rate must be at least $10"),
  availabilityStart: z.string(),
  availabilityEnd: z.string(),
});

const TutorDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    "Mathematics", "Science", "English", "History", 
    "Programming", "Physics", "Chemistry", "Biology"
  ];

  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      subjects: [],
      experience: "",
      hourlyRate: undefined,
      availabilityStart: "09:00",
      availabilityEnd: "17:00",
    }
  });

  const onSubmit = async (values: z.infer<typeof portfolioSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tutor_portfolios')
        .upsert({
          tutor_id: supabase.auth.getUser().then(res => res.data.user?.id),
          subjects: values.subjects,
          experience: values.experience,
          hourly_rate: values.hourlyRate,
          availability_start: values.availabilityStart,
          availability_end: values.availabilityEnd,
        });

      if (error) throw error;

      toast({
        title: "Portfolio Updated",
        description: "Your tutor portfolio has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update portfolio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tutor Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Your Portfolio</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects You Can Teach</FormLabel>
                    <Select
                      multiple
                      onValueChange={(values) => field.onChange(values)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input 
                        placeholder="Describe your teaching experience" 
                        {...field} 
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
                {isLoading ? "Saving..." : "Update Portfolio"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TutorDashboard;
