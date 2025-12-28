import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import EventModal from '@/components/EventModal';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Event, ClubType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, Sparkles } from 'lucide-react';
import { clubIcons } from '@/data/mockData';

const StudentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<ClubType | 'all'>('all');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'student') {
    return <Navigate to="/admin" replace />;
  }

  const clubs: { id: ClubType | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Events', icon: '🎯' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' },
    { id: 'dance', label: 'Dance', icon: '💃' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'podcast', label: 'Podcast', icon: '🎙️' },
    { id: 'radio', label: 'Radio', icon: '📻' },
    { id: 'technical', label: 'Technical', icon: '💻' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClub = selectedClub === 'all' || event.club === selectedClub;
      
      return matchesSearch && matchesClub && event.isActive;
    });
  }, [events, searchQuery, selectedClub]);

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Welcome back!</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-muted-foreground">
                Discover and register for exciting campus events
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-[73px] z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-card border-border"
              />
            </div>

            {/* Club Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {clubs.map((club) => (
                <Button
                  key={club.id}
                  variant={selectedClub === club.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedClub(club.id)}
                  className={`whitespace-nowrap rounded-full ${
                    selectedClub === club.id 
                      ? 'bg-primary text-primary-foreground shadow-medium' 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <span className="mr-1">{club.icon}</span>
                  {club.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedClub !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Check back later for new events!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {selectedClub === 'all' ? 'All Events' : clubs.find(c => c.id === selectedClub)?.label}
                <span className="text-muted-foreground font-normal ml-2">
                  ({filteredEvents.length})
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EventCard
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default StudentDashboard;
