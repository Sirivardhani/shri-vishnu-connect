import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Calendar, Users, Bell, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { clubIcons } from '@/data/mockData';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Discover Events',
      description: 'Browse all upcoming college events from various clubs and committees in one place.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Easy Registration',
      description: 'Register for events with a single click. No more paper forms or long queues.',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Stay Updated',
      description: 'Get instant notifications about new events and important announcements.',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Club Management',
      description: 'For admins: Create, edit, and manage events with powerful dashboard tools.',
    },
  ];

  const clubs = Object.entries(clubIcons).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to SVECW Events Portal 2025</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              Your Gateway to{' '}
              <span className="gradient-text">College Events</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Shri Vishnu Engineering College for Women presents the ultimate platform 
              for discovering, registering, and managing campus events seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Already have an account?
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">50+</p>
                <p className="text-sm text-muted-foreground">Events/Year</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">10+</p>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">3000+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Section */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground mb-8">Our Active Clubs</p>
          <div className="flex flex-wrap justify-center gap-8">
            {clubs.map(([club, icon]) => (
              <div 
                key={club}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-foreground capitalize">{club}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A modern platform designed to make event management effortless for both students and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            
            <div className="relative px-8 py-16 lg:py-24 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Explore Events?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of SVECW students who are already using this platform to stay connected with campus life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="secondary" size="xl">
                    Create Student Account
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="glass" size="xl" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Admin Registration
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SV</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">SVECW Events Portal</p>
                <p className="text-sm text-muted-foreground">Shri Vishnu Engineering College for Women</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SVECW. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
