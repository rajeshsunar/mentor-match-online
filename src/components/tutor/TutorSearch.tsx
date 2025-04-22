
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const searchSchema = z.object({
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface TutorSearchProps {
  onSearch: (filters: SearchFormValues) => void;
  className?: string;
  simplified?: boolean;
}

const TutorSearch = ({ onSearch, className = "", simplified = false }: TutorSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      location: "",
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    setIsSearching(true);
    try {
      onSearch(values);
    } finally {
      setIsSearching(false);
    }
  };

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Programming",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Foreign Languages",
  ];

  const gradeLevels = [
    "Elementary",
    "Middle School",
    "High School",
    "College",
    "Adult Education",
  ];

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className={`space-y-4 ${simplified ? "md:flex md:space-y-0 md:space-x-4" : "grid grid-cols-1 md:grid-cols-3 gap-4"}`}
        >
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex-1">
                {!simplified && <div className="mb-2 text-sm font-medium">Subject</div>}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
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
            name="gradeLevel"
            render={({ field }) => (
              <FormItem className="flex-1">
                {!simplified && <div className="mb-2 text-sm font-medium">Grade Level</div>}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradeLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
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
            name="location"
            render={({ field }) => (
              <FormItem className="flex-1">
                {!simplified && <div className="mb-2 text-sm font-medium">Location</div>}
                <FormControl>
                  <Input
                    placeholder="Location (City, State)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!simplified ? (
            <Button type="submit" className="md:col-span-3" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search Tutors"}
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={isSearching}>
              <Search className="h-4 w-4" />
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TutorSearch;
