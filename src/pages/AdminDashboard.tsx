import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Event, ClubType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, Calendar, Users, TrendingUp, Search, 
  Pencil, Trash2, Eye, MoreHorizontal, 
  ChevronDown, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { clubColors, clubIcons } from '@/data/mockData';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { events, registrations, addEvent, updateEvent, deleteEvent, getEventRegistrations } = useEvents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventForView, setSelectedEventForView] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { 
      label: 'Total Events', 
      value: events.length, 
      icon: <Calendar className="h-5 w-5" />,
      color: 'from-primary to-purple-600'
    },
    { 
      label: 'Active Events', 
      value: events.filter(e => e.isActive).length, 
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Total Registrations', 
      value: registrations.length, 
      icon: <Users className="h-5 w-5" />,
      color: 'from-accent to-orange-600'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage events and view registrations</p>
          </div>
          
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <CreateEventForm 
                onSuccess={() => setShowCreateModal(false)} 
                onClose={() => setShowCreateModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-soft"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-primary-foreground mb-4`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">All Events</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const colors = clubColors[event.club] || clubColors.cultural;
                  const icon = clubIcons[event.club] || '🎉';
                  const eventRegs = getEventRegistrations(event.id);
                  
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center text-xl">
                            {icon}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.venue}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {event.clubName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-foreground">{format(new Date(event.date), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{event.registeredCount}</span>
                          {event.maxParticipants && (
                            <span className="text-muted-foreground">/ {event.maxParticipants}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedEventForView(event)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              deleteEvent(event.id);
                              toast({
                                title: "Event deleted",
                                description: `${event.title} has been removed.`,
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* View Registrations Modal */}
      {selectedEventForView && (
        <Dialog open={!!selectedEventForView} onOpenChange={() => setSelectedEventForView(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrations for {selectedEventForView.title}</DialogTitle>
            </DialogHeader>
            <RegistrationsView 
              event={selectedEventForView} 
              registrations={getEventRegistrations(selectedEventForView.id)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <CreateEventForm 
              event={editingEvent}
              onSuccess={() => setEditingEvent(null)} 
              onClose={() => setEditingEvent(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Create/Edit Event Form Component
const CreateEventForm: React.FC<{
  event?: Event;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ event, onSuccess, onClose }) => {
  const { addEvent, updateEvent } = useEvents();
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    club: event?.club || '',
    clubName: event?.clubName || '',
    date: event?.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
    time: event?.time || '',
    venue: event?.venue || '',
    leaderName: event?.leaderName || '',
    leaderPhone: event?.leaderPhone || '',
    maxParticipants: event?.maxParticipants?.toString() || '',
  });

  const clubs = [
    { id: 'cultural', name: 'Cultural Committee' },
    { id: 'dance', name: 'Dance Club - Nrityam' },
    { id: 'music', name: 'Music Club - Swaranjali' },
    { id: 'sports', name: 'Sports Committee' },
    { id: 'podcast', name: 'Podcast Club' },
    { id: 'radio', name: 'Radio Club' },
    { id: 'technical', name: 'Technical Club' },
    { id: 'literary', name: 'Literary Club' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title: formData.title,
      description: formData.description,
      club: formData.club as ClubType,
      clubName: formData.clubName,
      date: new Date(formData.date),
      time: formData.time,
      venue: formData.venue,
      leaderName: formData.leaderName,
      leaderPhone: formData.leaderPhone,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      imageUrl: '/placeholder.svg',
    };

    if (event) {
      updateEvent(event.id, eventData);
      toast({
        title: "Event updated! ✅",
        description: `${formData.title} has been updated successfully.`,
      });
    } else {
      addEvent(eventData);
      toast({
        title: "Event created! 🎉",
        description: `${formData.title} is now live for registrations.`,
      });
    }
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Event Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your event..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Club *</Label>
          <Select 
            value={formData.club}
            onValueChange={(value) => {
              const club = clubs.find(c => c.id === value);
              setFormData({ 
                ...formData, 
                club: value,
                clubName: club?.name || ''
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {clubIcons[club.id]} {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max Participants</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Time *</Label>
          <Input
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="e.g., 5:00 PM - 8:00 PM"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Venue *</Label>
        <Input
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          placeholder="Enter event venue"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Coordinator Name *</Label>
          <Input
            value={formData.leaderName}
            onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
            placeholder="Event coordinator"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Coordinator Phone *</Label>
          <Input
            value={formData.leaderPhone}
            onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="gradient" className="flex-1">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

// Registrations View Component
const RegistrationsView: React.FC<{
  event: Event;
  registrations: any[];
}> = ({ event, registrations }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
        <div>
          <p className="text-sm text-muted-foreground">Total Registrations</p>
          <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No registrations yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.studentName}</TableCell>
                  <TableCell>{reg.rollNumber}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {reg.branch}
                    </span>
                  </TableCell>
                  <TableCell>{reg.year}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{reg.email}</p>
                      <p className="text-xs text-muted-foreground">{reg.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(reg.registeredAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
