
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TutorSearch from "@/components/tutor/TutorSearch";
import TutorGrid from "@/components/tutor/TutorGrid";

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<{
    subject?: string;
    gradeLevel?: string;
    location?: string;
  }>({});

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
  };

  const features = [
    {
      title: "Find the Perfect Match",
      description: "Search through qualified tutors by subject, grade level, and location to find your ideal learning partner.",
      icon: "👨‍🏫",
    },
    {
      title: "Verified Professionals",
      description: "All tutors undergo a thorough verification process ensuring quality education and safety.",
      icon: "✅",
    },
    {
      title: "Flexible Scheduling",
      description: "Schedule sessions that fit your calendar, with options for one-time help or recurring lessons.",
      icon: "📅",
    },
    {
      title: "Learn Your Way",
      description: "Choose between in-person or online tutoring options to match your learning preferences.",
      icon: "💻",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create an Account",
      description: "Sign up as a student and complete your profile to get started.",
    },
    {
      step: 2,
      title: "Find a Tutor",
      description: "Search for tutors based on subject, grade level, and location.",
    },
    {
      step: 3,
      title: "Schedule a Session",
      description: "Contact your chosen tutor and arrange your first session.",
    },
    {
      step: 4,
      title: "Learn & Succeed",
      description: "Meet with your tutor, learn effectively, and achieve your academic goals.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your Perfect Tutor For Academic Success
              </h1>
              <p className="text-lg mb-8 text-white/90">
                Connect with qualified tutors who can help you excel in any subject. 
                Personalized learning experiences tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="default" 
                  className="bg-white text-tutor-primary hover:bg-gray-100"
                  asChild
                >
                  <Link to="/tutors">Find a Tutor</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/become-tutor">Become a Tutor</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative bg-white/10 p-6 rounded-lg shadow-lg animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Find Your Tutor</h2>
              <TutorSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Tutors Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Tutors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most highly-rated tutors across various subjects who are ready to help you succeed.
            </p>
          </div>
          
          <TutorGrid filters={searchFilters} />
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/tutors">View All Tutors</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TutorFinder</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We connect students with expert tutors through a platform designed for educational success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with TutorFinder is easy. Follow these simple steps to begin your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-tutor-primary text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                
                {item.step < howItWorks.length && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-6"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/signup">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials/CTA Section */}
      <section className="py-16 px-6 bg-tutor-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in Your Studies?</h2>
          <p className="text-lg mb-8">
            Join thousands of students who have achieved academic success with TutorFinder.
            Find your perfect tutor today and take the first step toward reaching your educational goals.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-tutor-primary hover:bg-gray-100"
            asChild
          >
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
