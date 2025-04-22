
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const stepsForStudents = [
    {
      title: "Create Your Account",
      description: "Sign up as a student and verify your email address to get started.",
      details: "Your account lets you search for tutors, save favorites, and track your learning journey.",
      icon: "👤",
    },
    {
      title: "Search for Tutors",
      description: "Use our filters to find tutors by subject, grade level, and location.",
      details: "Browse tutor profiles, review ratings, and find the perfect match for your learning style.",
      icon: "🔍",
    },
    {
      title: "Contact and Schedule",
      description: "Reach out to tutors through our platform and arrange your tutoring sessions.",
      details: "Discuss your learning goals, preferred schedule, and session format (in-person or online).",
      icon: "📅",
    },
    {
      title: "Attend Sessions",
      description: "Meet with your tutor and start learning according to your personalized plan.",
      details: "Track your progress, provide feedback, and adjust your learning plan as needed.",
      icon: "📚",
    },
  ];

  const stepsForTutors = [
    {
      title: "Create a Tutor Profile",
      description: "Sign up as a tutor and complete your professional profile with your credentials.",
      details: "Add your education, expertise, teaching approach, and set your hourly rate.",
      icon: "👨‍🏫",
    },
    {
      title: "Get Verified",
      description: "Complete our verification process to establish credibility with students.",
      details: "Verify your identity, education credentials, and teaching experience.",
      icon: "✅",
    },
    {
      title: "Receive Requests",
      description: "Students will contact you through the platform to request tutoring sessions.",
      details: "Respond promptly to inquiries and discuss session details with interested students.",
      icon: "📨",
    },
    {
      title: "Start Teaching",
      description: "Begin tutoring sessions and help students achieve their academic goals.",
      details: "Track your sessions, receive reviews, and build your reputation on the platform.",
      icon: "🎓",
    },
  ];

  const faq = [
    {
      question: "How much does it cost to use TutorFinder?",
      answer: "TutorFinder is free for students to sign up and search for tutors. Tutors set their own hourly rates which are displayed on their profiles. There are no hidden fees or subscriptions required.",
    },
    {
      question: "How are tutors vetted on your platform?",
      answer: "All tutors undergo a verification process that includes identity verification, credential checking, and background screening. We also maintain a review system where students can rate their experience with tutors.",
    },
    {
      question: "Can I change tutors if I'm not satisfied?",
      answer: "Yes, you're free to work with any tutor on our platform. If you're not satisfied with a tutor, you can search for and contact other tutors at any time.",
    },
    {
      question: "Are sessions in-person or online?",
      answer: "TutorFinder supports both in-person and online tutoring. You can filter tutors based on their availability for either mode, and discuss your preference when arranging sessions.",
    },
    {
      question: "How do I pay my tutor?",
      answer: "Payment arrangements are made directly between you and your tutor. You can discuss payment methods with your tutor when arranging your sessions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-tutor-primary text-white py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">How TutorFinder Works</h1>
            <p className="text-xl max-w-3xl mx-auto">
              TutorFinder connects students with expert tutors through a simple, four-step process designed to make learning accessible and effective.
            </p>
          </div>
        </div>
        
        {/* For Students */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Students</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Finding the right tutor for your educational needs is easy with our simple process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {stepsForStudents.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="bg-tutor-light text-tutor-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <p className="text-gray-500 text-sm">{step.details}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button asChild>
                <Link to="/signup">Get Started as a Student</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* For Tutors */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Tutors</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our platform of educational professionals and help students achieve their academic goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {stepsForTutors.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="bg-tutor-accent text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <p className="text-gray-500 text-sm">{step.details}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button asChild className="bg-tutor-accent hover:bg-tutor-accent/90">
                <Link to="/become-tutor">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about using the TutorFinder platform.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {faq.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-tutor-primary text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Join TutorFinder today and take the first step toward academic success or sharing your knowledge with students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-tutor-primary hover:bg-gray-100"
                asChild
              >
                <Link to="/signup">Sign Up as Student</Link>
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
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
