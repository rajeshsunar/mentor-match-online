
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TutorSearch from "@/components/tutor/TutorSearch";
import TutorGrid from "@/components/tutor/TutorGrid";

const StudentDashboard = () => {
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
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Tutor Search Section */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Find a Tutor</h2>
            <TutorSearch onSearch={handleSearch} />
            
            <div className="mt-6">
              <TutorGrid filters={searchFilters} />
            </div>
          </div>
          
          {/* Session History Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Session History</h2>
            <div className="bg-white shadow rounded-lg p-4">
              {/* TODO: Implement actual session history */}
              <p className="text-gray-500">No sessions yet.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
