
import { useState, useEffect } from "react";
import TutorCard, { TutorType } from "./TutorCard";
import { useToast } from "@/components/ui/use-toast";

interface TutorGridProps {
  filters?: {
    subject?: string;
    gradeLevel?: string;
    location?: string;
  };
}

// Sample tutor data - in a real app this would come from an API
const mockTutors: TutorType[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    subjects: ["Mathematics", "Physics"],
    gradeLevel: "High School",
    location: "New York, NY",
    hourlyRate: 45,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "2",
    name: "Michael Chen",
    subjects: ["Programming", "Mathematics"],
    gradeLevel: "College",
    location: "San Francisco, CA",
    hourlyRate: 60,
    rating: 4.7,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    subjects: ["English", "History"],
    gradeLevel: "Middle School",
    location: "Austin, TX",
    hourlyRate: 35,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "4",
    name: "James Wilson",
    subjects: ["Chemistry", "Biology"],
    gradeLevel: "High School",
    location: "Chicago, IL",
    hourlyRate: 50,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    subjects: ["Foreign Languages", "English"],
    gradeLevel: "Elementary",
    location: "Miami, FL",
    hourlyRate: 40,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "6",
    name: "Robert Davis",
    subjects: ["Mathematics", "Science"],
    gradeLevel: "Middle School",
    location: "Seattle, WA",
    hourlyRate: 38,
    rating: 4.5,
  },
];

const TutorGrid = ({ filters }: TutorGridProps) => {
  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call with filtering
    setIsLoading(true);
    const fetchTutors = () => {
      setTimeout(() => {
        let filteredTutors = [...mockTutors];
        
        if (filters) {
          if (filters.subject) {
            filteredTutors = filteredTutors.filter(tutor => 
              tutor.subjects.includes(filters.subject || "")
            );
          }
          
          if (filters.gradeLevel) {
            filteredTutors = filteredTutors.filter(tutor => 
              tutor.gradeLevel === filters.gradeLevel
            );
          }
          
          if (filters.location) {
            filteredTutors = filteredTutors.filter(tutor => 
              tutor.location.toLowerCase().includes(filters.location?.toLowerCase() || "")
            );
          }
        }
        
        setTutors(filteredTutors);
        setIsLoading(false);
        
        if (filters && Object.values(filters).some(value => value)) {
          toast({
            title: `Found ${filteredTutors.length} tutors`,
            description: "Results matching your search criteria",
            duration: 3000,
          });
        }
      }, 800); // Simulate network delay
    };
    
    fetchTutors();
  }, [filters, toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-72 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No tutors found</h3>
        <p className="text-gray-500">
          Try adjusting your search filters to find more tutors.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
};

export default TutorGrid;
