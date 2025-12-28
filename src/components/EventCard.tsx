import React from 'react';
import { Event } from '@/types';
import { clubColors, clubIcons } from '@/data/mockData';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const colors = clubColors[event.club] || clubColors.cultural;
  const icon = clubIcons[event.club] || '🎉';

  const spotsLeft = event.maxParticipants 
    ? event.maxParticipants - event.registeredCount 
    : null;

  return (
    <div 
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 cursor-pointer hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-600/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl transform group-hover:scale-125 transition-transform duration-500">
            {icon}
          </span>
        </div>
        
        {/* Club Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
          {event.clubName}
        </div>

        {/* Spots Badge */}
        {spotsLeft !== null && spotsLeft <= 50 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium bg-accent text-accent-foreground animate-pulse-soft">
            {spotsLeft} spots left!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Registration Stats */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {event.registeredCount} registered
            </span>
          </div>
          <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>

      {/* Hover Gradient Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-primary via-purple-500 to-accent">
          <div className="w-full h-full rounded-2xl bg-card" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
