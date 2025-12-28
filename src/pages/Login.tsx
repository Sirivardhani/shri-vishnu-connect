import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { GraduationCap, ShieldCheck, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!selectedRole) {
      toast({
        title: "Select a role",
        description: "Please select whether you're a student or admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(data.email, data.password, selectedRole);
      
      toast({
        title: "Welcome back! 👋",
        description: "You've successfully logged in.",
      });

      navigate(selectedRole === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-12 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center mb-8">
            <span className="text-primary-foreground font-bold text-3xl">SV</span>
          </div>
          
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Welcome Back!
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Sign in to continue exploring campus events at SVECW.
          </p>

          <div className="p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20">
            <p className="text-primary-foreground/90 italic">
              "The events portal has made it so much easier to stay connected with all the exciting activities happening on campus!"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                👩‍🎓
              </div>
              <div>
                <p className="text-primary-foreground font-medium">Priya M.</p>
                <p className="text-primary-foreground/60 text-sm">CSE, 3rd Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 right-20 text-8xl animate-float">🎓</div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to continue</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'student'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  selectedRole === 'student'
                    ? 'bg-gradient-to-br from-primary to-purple-600'
                    : 'bg-secondary'
                }`}>
                  <GraduationCap className={`h-6 w-6 ${
                    selectedRole === 'student' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                <span className={`font-medium ${
                  selectedRole === 'student' ? 'text-primary' : 'text-foreground'
                }`}>Student</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'admin'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50 bg-card'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-br from-accent to-orange-600'
                    : 'bg-secondary'
                }`}>
                  <ShieldCheck className={`h-6 w-6 ${
                    selectedRole === 'admin' ? 'text-accent-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                <span className={`font-medium ${
                  selectedRole === 'admin' ? 'text-accent' : 'text-foreground'
                }`}>Admin</span>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@svecw.edu.in"
                {...register('email')}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className="h-12"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              size="lg" 
              className="w-full mt-6"
              disabled={isSubmitting || !selectedRole}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
