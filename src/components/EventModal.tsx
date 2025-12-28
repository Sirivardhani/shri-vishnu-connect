import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import { clubColors, clubIcons } from '@/data/mockData';
import { Calendar, Clock, MapPin, Users, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import EventRegistrationForm from './EventRegistrationForm';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const [showRegistration, setShowRegistration] = useState(false);

  if (!event) return null;

  const colors = clubColors[event.club] || clubColors.cultural;
  const icon = clubIcons[event.club] || '🎉';
  const spotsLeft = event.maxParticipants 
    ? event.maxParticipants - event.registeredCount 
    : null;

  if (showRegistration) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Register for {event.title}</DialogTitle>
          </DialogHeader>
          <EventRegistrationForm 
            event={event} 
            onSuccess={() => {
              setShowRegistration(false);
              onClose();
            }}
            onCancel={() => setShowRegistration(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className="relative h-56 overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-purple-600/90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl animate-float">{icon}</span>
          </div>
          <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
            {event.clubName}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-foreground pr-8">
              {event.title}
            </DialogTitle>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </DialogHeader>

          {/* Event Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Venue</p>
                <p className="font-medium text-foreground">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registrations</p>
                <p className="font-medium text-foreground">
                  {event.registeredCount} {spotsLeft !== null && `/ ${event.maxParticipants}`}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <h4 className="font-semibold text-foreground mb-3">Event Coordinator</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{event.leaderName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Contact:</span>
                <a href={`tel:${event.leaderPhone}`} className="font-medium text-primary hover:underline">
                  {event.leaderPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Spots Warning */}
          {spotsLeft !== null && spotsLeft <= 50 && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
              <p className="text-accent font-semibold text-center">
                ⚡ Hurry! Only {spotsLeft} spots remaining!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              variant="gradient" 
              onClick={() => setShowRegistration(true)} 
              className="flex-1"
              disabled={spotsLeft !== null && spotsLeft <= 0}
            >
              {spotsLeft !== null && spotsLeft <= 0 ? 'Fully Booked' : 'Register Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
