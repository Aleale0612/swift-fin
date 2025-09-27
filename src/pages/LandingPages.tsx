import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Star, 
  StarHalf, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Smartphone,
  BarChart3,
  PieChart,
  Target,
  Users,
  ArrowRight,
  ArrowLeft,
  Quote,
  Check,
  X,
  Sparkles,
  Zap,
  Award,
  Crown,
  Rocket,
  Lightbulb,
  DollarSign,
  Code,
  Lock,
  Heart,
  Eye
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Freelancer",
    avatar: "BS",
    rating: 5,
    comment: "This app really helps me manage my finances as a freelancer. I can easily track income and expenses!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Siti Rahayu",
    role: "Housewife",
    avatar: "SR",
    rating: 4.5,
    comment: "As a housewife, I can manage the family's shopping budget better. The category feature is very helpful!",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Ahmad Wijaya",
    role: "Entrepreneur",
    avatar: "AW",
    rating: 5,
    comment: "I use this app to manage my business finances. The financial reports are very detailed and easy to understand.",
    date: "3 days ago"
  },
  {
    id: 4,
    name: "Maya Putri",
    role: "Student",
    avatar: "MP",
    rating: 4,
    comment: "As a student, I need to manage my allowance wisely. This app helps me not to be wasteful.",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    role: "Private Employee",
    avatar: "RH",
    rating: 5,
    comment: "The bill reminder feature is very useful! I never miss paying bills since using this app.",
    date: "1 week ago"
  },
  {
    id: 6,
    name: "Dewi Lestari",
    role: "Business Owner",
    avatar: "DL",
    rating: 4.5,
    comment: "I can monitor my business cash flow easily. The graphs and charts are very informative.",
    date: "4 days ago"
  },
  {
    id: 7,
    name: "Fajar Nugroho",
    role: "Investor",
    avatar: "FN",
    rating: 5,
    comment: "The best finance app I've ever used. The target and goal features really help with financial planning.",
    date: "2 weeks ago"
  },
  {
    id: 8,
    name: "Rina Susanti",
    role: "Teacher",
    avatar: "RS",
    rating: 4,
    comment: "Simple yet powerful. I can manage family finances without hassle. Highly recommended!",
    date: "6 days ago"
  },
  {
    id: 9,
    name: "Hendra Pratama",
    role: "Developer",
    avatar: "HP",
    rating: 5,
    comment: "The UI/UX is very clean and modern. The CSV export feature is very helpful for monthly reports.",
    date: "1 week ago"
  },
  {
    id: 10,
    name: "Linda Wijaya",
    role: "Marketing",
    avatar: "LW",
    rating: 4.5,
    comment: "I can track business expenses easily. Transaction categories are very complete.",
    date: "3 days ago"
  },
  {
    id: 11,
    name: "Bambang Suryo",
    role: "Doctor",
    avatar: "BS",
    rating: 4,
    comment: "As a busy doctor, I need a simple app. This is the answer! Easy to use.",
    date: "1 week ago"
  },
  {
    id: 12,
    name: "Yuniarti",
    role: "Designer",
    avatar: "YU",
    rating: 5,
    comment: "Love the dark mode! Very comfortable to use at night. The statistics feature is very helpful.",
    date: "5 days ago"
  },
  {
    id: 13,
    name: "Eko Prasetyo",
    role: "Shop Owner",
    avatar: "EP",
    rating: 4.5,
    comment: "Now I can know which products are selling well and which are not. Very helpful for business!",
    date: "4 days ago"
  },
  {
    id: 14,
    name: "Fitri Handayani",
    role: "Accountant",
    avatar: "FH",
    rating: 5,
    comment: "As an accountant, I highly recommend this app. Financial reports are very accurate and detailed.",
    date: "2 weeks ago"
  },
  {
    id: 15,
    name: "Rizki Firmansyah",
    role: "Student",
    avatar: "RF",
    rating: 4,
    comment: "This app teaches me how to manage finances from an early age. Very useful for the future!",
    date: "1 week ago"
  }
];

// Features data
const features = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Financial Reports",
    description: "Monitor income and expenses with easy-to-understand graphs",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: <PieChart className="h-8 w-8" />,
    title: "Transaction Categories",
    description: "Group transactions by category for deeper analysis",
    color: "from-purple-500 to-pink-400"
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Targets & Goals",
    description: "Set financial targets and track your progress",
    color: "from-green-500 to-emerald-400"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Debt Management",
    description: "Record debts and set payment schedules easily",
    color: "from-amber-500 to-orange-400"
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Smart Notifications",
    description: "Bill reminders and spending limits to keep finances in check",
    color: "from-indigo-500 to-blue-400"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Data Security",
    description: "Your financial data is safe with end-to-end encryption",
    color: "from-rose-500 to-red-400"
  }
];

// Pricing data
const pricingPlans = [
  {
    name: "Free",
    price: "0",
    period: "/month",
    description: "Try our basic features",
    features: [
      { name: "10 transactions/month", available: true },
      { name: "1 category", available: true },
      { name: "Basic reports", available: true },
      { name: "Export data", available: false },
      { name: "Priority support", available: false }
    ],
    popular: false,
    buttonText: "Choose Plan",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    price: "49",
    period: "/month",
    description: "For personal users",
    features: [
      { name: "Unlimited transactions", available: true },
      { name: "Unlimited categories", available: true },
      { name: "Complete reports", available: true },
      { name: "Export data", available: true },
      { name: "Priority support", available: false }
    ],
    popular: true,
    buttonText: "Choose Plan",
    buttonVariant: "default"
  },
  {
    name: "Business",
    price: "99",
    period: "/month",
    description: "For business and teams",
    features: [
      { name: "All Pro features", available: true },
      { name: "Multi-user", available: true },
      { name: "API integration", available: true },
      { name: "Export data", available: true },
      { name: "Priority support", available: true }
    ],
    popular: false,
    buttonText: "Choose Plan",
    buttonVariant: "outline"
  }
];

// Stats data
const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "50,000+", label: "Transactions/Month" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.8/5", label: "User Rating" }
];

// About section data
const aboutPoints = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Personal Financial Health",
    description: "Built from personal experience to help manage finances in a healthy and sustainable way"
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Security First",
    description: "As a developer, I understand the importance of keeping your financial data secure and private"
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Developer's Perspective",
    description: "Created with clean code and best practices to ensure reliability and performance"
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Transparency",
    description: "No hidden fees or complex terms - just straightforward financial management"
  }
];

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        if (starValue <= rating) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        } else if (starValue - 0.5 <= rating) {
          return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        } else {
          return <Star key={i} className="h-4 w-4 text-gray-300" />;
        }
      })}
    </div>
  );
};

// Testimonial card component
const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-md overflow-hidden group">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center font-medium text-white shadow-md">
            {testimonial.avatar}
          </div>
          <div className="ml-3">
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
        <div className="mb-3">
          <StarRating rating={testimonial.rating} />
        </div>
        <div className="relative mb-3">
          <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
          <p className="text-sm pl-4 italic">{testimonial.comment}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{testimonial.date}</p>
      </CardContent>
    </Card>
  );
};

// Feature card component
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group h-full">
      <CardContent className="p-6 relative">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
        <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
          {feature.icon}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
        <div className="mt-4 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};

// Pricing card component
const PricingCard = ({ plan }: { plan: typeof pricingPlans[0] }) => {
  return (
    <Card className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-md overflow-hidden ${plan.popular ? 'ring-2 ring-primary relative' : ''}`}>
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
          <Crown className="h-3 w-3 mr-1" /> Most Popular
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground mb-4">{plan.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">Rp{plan.price}</span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center">
              {feature.available ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-gray-300 mr-2" />
              )}
              <span className={feature.available ? "" : "text-muted-foreground"}>{feature.name}</span>
            </li>
          ))}
        </ul>
        <Button 
          variant={plan.buttonVariant as "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"} 
          className="w-full"
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

// About point component
const AboutPoint = ({ point, index }: { point: typeof aboutPoints[0], index: number }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`mb-4 p-3 rounded-full bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-500 to-cyan-400' : 'from-purple-500 to-pink-400'} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
        {point.icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{point.title}</h3>
      <p className="text-muted-foreground">{point.description}</p>
    </div>
  );
};

// Stat card component
const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(stat.value.replace(/[^0-9.]/g, ''));
  
  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const increment = targetValue / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [targetValue]);
  
  return (
    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/50 border border-border shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md">
      <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-600 to-cyan-500' : 'from-purple-600 to-pink-500'} bg-clip-text text-transparent`}>
        {count}{stat.value.includes('+') && '+'}{stat.value.includes('%') && '%'}
      </div>
      <p className="text-muted-foreground">{stat.label}</p>
    </div>
  );
};

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

// Floating elements component
const FloatingElements = () => {
  const elements = [
    { icon: <DollarSign className="h-6 w-6" />, top: '10%', left: '5%', delay: '0s' },
    { icon: <BarChart3 className="h-6 w-6" />, top: '20%', right: '10%', delay: '0.5s' },
    { icon: <PieChart className="h-6 w-6" />, top: '60%', left: '8%', delay: '1s' },
    { icon: <Target className="h-6 w-6" />, top: '70%', right: '5%', delay: '1.5s' },
    { icon: <Wallet className="h-6 w-6" />, top: '40%', left: '15%', delay: '2s' },
    { icon: <TrendingUp className="h-6 w-6" />, top: '30%', right: '15%', delay: '2.5s' },
  ];
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((el, idx) => (
        <div 
          key={idx}
          className={`absolute text-primary/20 animate-bounce`}
          style={{
            top: el.top,
            left: el.left,
            right: el.right,
            animationDelay: el.delay,
            animationDuration: '3s'
          }}
        >
          {el.icon}
        </div>
      ))}
    </div>
  );
};

export default function LandingPage() {
  const { theme } = useTheme();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Determine active section
      const sections = [
        { id: 'home', ref: heroRef },
        { id: 'about', ref: aboutRef },
        { id: 'features', ref: featuresRef },
        { id: 'testimonials', ref: testimonialsRef },
        { id: 'pricing', ref: pricingRef }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextTestimonials = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonialIndex((prev) => 
        prev === totalPages - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const prevTestimonials = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonialIndex((prev) => 
        prev === 0 ? totalPages - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const currentTestimonials = testimonials.slice(
    currentTestimonialIndex * testimonialsPerPage,
    (currentTestimonialIndex + 1) * testimonialsPerPage
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">TrekFi</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'features', label: 'Features' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'pricing', label: 'Pricing' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className={`relative py-1 transition-colors duration-300 ${activeSection === item.id ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button className="shadow-lg hover:shadow-xl transition-shadow duration-300" asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full border-primary/30 text-primary bg-primary/5 backdrop-blur-sm animate-pulse">
              <TrendingUp className="h-4 w-4 mr-2" />
              #1 Personal Finance App
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Manage Your Finances <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Intelligently</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Track income, manage expenses, and achieve your financial goals with ease. 
              All in one intuitive and powerful application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group" asChild>
                <Link to="/auth" className="flex items-center">
                  Get Started Free
                  <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" onClick={() => scrollToSection('features')}>
                View Features
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
              <Lightbulb className="h-3 w-3 mr-1" />
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Purpose</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              The goal of this web development is a personal mission to manage finances in a healthy and secure way, 
              addressing my own concerns as a web developer.
            </p>
            <p className="text-muted-foreground">
              As a developer, I understand the importance of creating tools that not only function well but also 
              protect user data and provide genuine value. TrekFi was born from my own financial journey and the 
              desire to create a solution that I would trust with my own financial information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutPoints.map((point, index) => (
              <AboutPoint key={index} point={point} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3 mr-1" />
              Key Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Manage Your Finances More <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Effectively</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to control your personal and business finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
          
          {/* Feature Highlight */}
          <div className="mt-20 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border border-border shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">In-depth Financial Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Get comprehensive insights into your spending habits with easy-to-understand graphs and reports. 
                  Identify savings opportunities and optimize your budget.
                </p>
                <Button className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  Try Now
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 flex items-center justify-center">
                        <PieChart className="h-16 w-16 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
              <Quote className="h-3 w-3 mr-1" />
              User Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Users</span> Say
            </h2>
            <p className="text-muted-foreground">
              Over 10,000 users have transformed their finances with TrekFi
            </p>
          </div>
          
          <div className="relative">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {currentTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonials}
                  disabled={currentTestimonialIndex === 0}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonialIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentTestimonialIndex ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonials}
                  disabled={currentTestimonialIndex === totalPages - 1}
                  className="rounded-full"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Join Now
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Manage Your Finances?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who have transformed the way they manage their money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" asChild>
                <Link to="/auth">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => scrollToSection('features')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
              <Award className="h-3 w-3 mr-1" />
              Choose Your Plan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Select a Plan That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Fits</span> Your Needs
            </h2>
            <p className="text-muted-foreground">
              All plans come with the best security and privacy features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} />
            ))}
          </div>
          
          {/* Pricing FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                {
                  question: "Are there any hidden fees?",
                  answer: "No, all listed prices are final with no hidden fees."
                },
                {
                  question: "Can I switch plans at any time?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time without penalty."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes, we use end-to-end encryption to protect your financial data."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes, the Free plan is available forever with powerful basic features."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-background p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">TrekFi</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The best personal finance app to manage your money.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                    <div className="w-5 h-5 bg-current rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Updates"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Press"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Privacy", "Terms"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center">
                        {link}
                        <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2025 TrekFi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}