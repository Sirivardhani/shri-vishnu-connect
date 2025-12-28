import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event, Branch } from '@/types';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  rollNumber: z.string().min(5, 'Please enter a valid roll number'),
  branch: z.string().min(1, 'Please select your branch'),
  year: z.string().min(1, 'Please select your year'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface EventRegistrationFormProps {
  event: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

const branches: Branch[] = ['CSE', 'AIML', 'AIDS', 'IT', 'ECE', 'CIVIL', 'MECH', 'EEE'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({ event, onSuccess, onCancel }) => {
  const { registerForEvent } = useEvents();
  const { user } = useAuth();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      registerForEvent({
        eventId: event.id,
        studentId: user?.id || 'guest',
        studentName: data.name,
        branch: data.branch as Branch,
        email: data.email,
        phone: data.phone,
        rollNumber: data.rollNumber,
        year: data.year,
      });

      toast({
        title: "Registration Successful! 🎉",
        description: `You've been registered for ${event.title}`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          {...register('name')}
          className="h-11"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rollNumber">Roll Number *</Label>
        <Input
          id="rollNumber"
          placeholder="e.g., 21B01A0501"
          {...register('rollNumber')}
          className="h-11"
        />
        {errors.rollNumber && (
          <p className="text-sm text-destructive">{errors.rollNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Branch *</Label>
          <Select onValueChange={(value) => setValue('branch', value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.branch && (
            <p className="text-sm text-destructive">{errors.branch.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Year *</Label>
          <Select onValueChange={(value) => setValue('year', value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@svecw.edu.in"
          {...register('email')}
          className="h-11"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          {...register('phone')}
          className="h-11"
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="gradient" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </form>
  );
};

export default EventRegistrationForm;
