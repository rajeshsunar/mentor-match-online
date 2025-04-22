
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
import { Slider } from "@/components/ui/slider";

const searchSchema = z.object({
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  location: z.string().optional(),
  maxPrice: z.number().min(0).optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface TutorSearchProps {
  onSearch: (filters: SearchFormValues) => void;
  className?: string;
  simplified?: boolean;
  showPriceFilter?: boolean;
}

const TutorSearch = ({ onSearch, className = "", simplified = false, showPriceFilter = false }: TutorSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [priceRange, setPriceRange] = useState([300]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      location: "",
      maxPrice: showPriceFilter ? 100 : undefined,
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    setIsSearching(true);
    try {
      if (showPriceFilter) {
        values.maxPrice = priceRange[0];
      }
      onSearch(values);
    } finally {
      setIsSearching(false);
    }
  };

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "Nepali",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Social Studies",
  ];

  const gradeLevels = [
    "Elementary",
    "Secondary School",
    "High Secondary School",
  ];

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    form.setValue("maxPrice", value[0]);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-4"
        >
          <div className={simplified ? "md:flex md:space-y-0 md:space-x-4" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
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
          </div>
          
          {showPriceFilter && (
            <div className="pt-2">
              <div className="mb-2 text-sm font-medium">Max Hourly Rate: Rs.{priceRange[0]}</div>
              <Slider
                defaultValue={[500]}
                max={1000}
                min = {300}
                step={50}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="my-6"
              />
            </div>
          )}
          
          {!simplified ? (
            <Button type="submit" className={showPriceFilter ? "" : "md:col-span-3"} disabled={isSearching}>
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
