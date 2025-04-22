
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface TutorType {
  id: string;
  name: string;
  subjects: string[];
  gradeLevel: string;
  location: string;
  hourlyRate: number;
  rating: number;
  imageUrl?: string;
}

interface TutorCardProps {
  tutor: TutorType;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  // In a real app, this state would be managed through a global state management solution
  const [isContactClicked, setIsContactClicked] = useState(false);

  // Generate initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Display rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? "text-yellow-400" 
                : i < rating 
                  ? "text-yellow-200" 
                  : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden card-hover transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-tutor-light">
              <AvatarImage src={tutor.imageUrl} alt={tutor.name} />
              <AvatarFallback className="bg-tutor-primary text-white">
                {getInitials(tutor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{tutor.name}</h3>
              <div className="flex items-center mt-1">
                {renderRating(tutor.rating)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-tutor-primary">
              ${tutor.hourlyRate}
              <span className="text-sm text-gray-500 font-normal">/hr</span>
            </p>
            <p className="text-sm text-gray-500">{tutor.location}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Grade Level:</span> {tutor.gradeLevel}
          </p>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="bg-tutor-light text-tutor-primary">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between">
        <Link to={`/tutors/${tutor.id}`} className="text-tutor-primary hover:underline text-sm">
          View Profile
        </Link>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsContactClicked(true)}
        >
          {isContactClicked ? "Request Sent" : "Contact Tutor"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
