import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserRole, Branch } from '@/types';
import { User, GraduationCap, ShieldCheck, ArrowLeft } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  branch: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const branches: Branch[] = ['CSE', 'AIML', 'AIDS', 'IT', 'ECE', 'CIVIL', 'MECH', 'EEE'];

const Register: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!selectedRole) {
      toast({
        title: "Select a role",
        description: "Please select whether you're a student or admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole,
        branch: data.branch,
        phone: data.phone,
      });

      toast({
        title: "Registration Successful! 🎉",
        description: "Welcome to SVECW Events Portal!",
      });

      navigate(selectedRole === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
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
            Join SVECW Events
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Create your account and start exploring campus events today.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>Discover all campus events</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>One-click event registration</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>Get instant notifications</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 right-20 text-8xl animate-float">🎓</div>
        <div className="absolute top-40 right-40 text-6xl animate-float" style={{ animationDelay: '2s' }}>🎉</div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Fill in your details to get started</p>
          </div>

          {/* Role Selection */}
          {!selectedRole ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">I am a...</p>
              
              <button
                onClick={() => setSelectedRole('student')}
                className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-foreground">Student</h3>
                    <p className="text-sm text-muted-foreground">Browse and register for events</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('admin')}
                className="w-full p-6 rounded-2xl border-2 border-border hover:border-accent bg-card hover:bg-accent/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-foreground">Admin / Club Lead</h3>
                    <p className="text-sm text-muted-foreground">Create and manage events</p>
                  </div>
                </div>
              </button>

              <p className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Change role</span>
              </button>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-6">
                <p className="text-sm text-muted-foreground">
                  Registering as: <span className="font-semibold text-foreground capitalize">{selectedRole}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className="h-12"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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

              {selectedRole === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select onValueChange={(value) => setValue('branch', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className="h-12"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...register('password')}
                  className="h-12"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  className="h-12"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
