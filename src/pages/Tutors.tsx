
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TutorSearch from "@/components/tutor/TutorSearch";
import TutorGrid from "@/components/tutor/TutorGrid";

const Tutors = () => {
  const [searchFilters, setSearchFilters] = useState<{
    subject?: string;
    gradeLevel?: string;
    location?: string;
  }>({});

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-tutor-primary text-white py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Find Tutors</h1>
            <p className="text-lg max-w-3xl">
              Browse our selection of qualified tutors and find the perfect match for your learning needs.
              Use the filters below to narrow your search.
            </p>
          </div>
        </div>
        
        {/* Search and Results */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
            <TutorSearch onSearch={handleSearch} />
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Available Tutors</h2>
            <p className="text-gray-600">
              Showing tutors matching your search criteria
            </p>
          </div>
          
          <TutorGrid filters={searchFilters} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tutors;
