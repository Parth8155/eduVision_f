import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  BookOpen,
  Search,
  FileText,
  Clock,
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import AnimatedTree from "../components/AnimatedTree";
import ErrorBoundary from "../components/ErrorBoundary";
import authService from "../services/authService";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [user, setUser] = useState(authService.getCurrentUser());

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  // Intersection Observer: trigger animations when elements enter the viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // for stagger children, also play the slide-up animation
            if (entry.target.classList.contains("stagger-child")) {
              entry.target.classList.add("animate-slide-up");
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".animate-on-scroll, .stagger-child").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: "10,000+", label: "Notes Processed" },
    { number: "95%", label: "OCR Accuracy" },
    { number: "50k+", label: "Questions Generated" },
    { number: "98%", label: "Student Satisfaction" },
  ];

  const features = [
    {
      icon: Upload,
      title: "Easy Upload & OCR",
      description:
        "Upload handwritten notes and get clear, accurate text extraction with built-in OCR technology",
    },
    {
      icon: BookOpen,
      title: "Study Materials Generator",
      description:
        "Create summaries, MCQs, and practice questions directly from your notes",
    },
    {
      icon: Search,
      title: "Organized Library",
      description:
        "Keep all your notes neatly categorized and searchable in one place",
    },
  ];

  const studyFeatures = [
  {
    icon: Upload,
    title: "1. Upload Notes",
    description:
      "Start by uploading your handwritten notes or study material in a few clicks",
  },
  {
    icon: FileText,
    title: "2. Extract Text",
    description:
      "The content is converted into clear, editable text for easy access",
  },
  {
    icon: BookOpen,
    title: "3. Summarize & Organize",
    description:
      "Get simplified summaries and neatly structured study points",
  },
  {
    icon: Clock,
    title: "4. Revise Anytime",
    description:
      "Access your notes anytime and revise efficiently at your own pace",
  },
];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
              eduVision
              </span>
            </Link>

      <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm nav-link"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Upload Notes
                  </Link>
                  <Link
                    to="/study-tools"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Study Tools
                  </Link>
                  <Link
                    to="/library"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Library
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    How it Works
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </a>
                  <a
                    href="#testimonials"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Reviews
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, {user?.firstName}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                  <Link to="/dashboard">
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm px-6">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm px-6">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <ErrorBoundary fallback="silent">
          <AnimatedTree />
        </ErrorBoundary>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white leading-tight hero-text-reveal animate-slide-down">
              Simplified Study Materials,
              <br />
              Seamless Everywhere
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in animate-slide-up delay-100">
              Upload, process, and manage your handwritten notes—effortlessly.
              With eduVision, you transform traditional studying into an
              intelligent, AI-powered learning experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isAuthenticated ? (
                <Link to="/upload">
                  <Button
                    size="lg"
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base hover-lift animate-scale-in"
                  >
                    Upload Notes
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base hover-lift animate-scale-in"
                  >
                    Get Started Free
                  </Button>
                </Link>
              )}
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 text-base"
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Feature Cards */}
            <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((v, i) => {
                const Icon = v.icon;
                return (
                  <Card className={`text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow stagger-child stagger-${(i%6)+1}`}> 
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-black dark:text-white" />
                      </div>
                      <CardTitle className="text-lg text-black dark:text-white">
                        {v.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                        {v.description}
                      </CardDescription>
                      {isAuthenticated ? (
                        <Link to="/upload">
                          <Button
                            size="sm"
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                          >
                            Upload Notes
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/register">
                          <Button
                            size="sm"
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                          >
                            Try Now
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
            How eduVision Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform your handwritten notes into powerful study materials with
            our AI-driven platform
          </p>

            <div className="grid md:grid-cols-4 gap-8">
            {studyFeatures.map((feature, index) => (
              <div key={index} className="text-center animate-on-scroll stagger-child stagger-2">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
   
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-gray-300 dark:text-gray-400 mb-8 text-lg">
            Join thousands of students who are already studying smarter with
            eduVision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-300 px-8 py-3 text-base"
                >
                  Upload Your First Notes
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-300 px-8 py-3 text-base"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                   <Button
                    size="lg"
                    className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-300 px-8 py-3 text-base"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold text-black dark:text-white">
                  eduVision
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Empowering students worldwide with AI-powered study tools that
                transform handwritten notes into comprehensive learning
                materials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black dark:text-white">
                Product
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black dark:text-white">
                Support
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400 footer-reveal animate-fade-in">
            <p>&copy; 2024 eduVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
