import React, { createContext, useContext, useState, useCallback } from 'react';
import { Event, EventRegistration, Notification } from '@/types';
import { mockEvents, mockRegistrations, mockNotifications } from '@/data/mockData';

interface EventContextType {
  events: Event[];
  registrations: EventRegistration[];
  notifications: Notification[];
  addEvent: (event: Omit<Event, 'id' | 'registeredCount' | 'isActive' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (registration: Omit<EventRegistration, 'id' | 'registeredAt'>) => void;
  getEventRegistrations: (eventId: string) => EventRegistration[];
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<EventRegistration[]>(mockRegistrations);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'registeredCount' | 'isActive' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      registeredCount: 0,
      isActive: true,
      createdAt: new Date(),
    };
    setEvents(prev => [newEvent, ...prev]);
    
    // Add notification for new event
    addNotification({
      title: `New Event: ${eventData.title}`,
      message: `${eventData.clubName} has announced a new event! Check it out and register now.`,
      eventId: newEvent.id,
    });
  }, []);

  const updateEvent = useCallback((id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setRegistrations(prev => prev.filter(reg => reg.eventId !== id));
  }, []);

  const registerForEvent = useCallback((registrationData: Omit<EventRegistration, 'id' | 'registeredAt'>) => {
    const newRegistration: EventRegistration = {
      ...registrationData,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date(),
    };
    setRegistrations(prev => [...prev, newRegistration]);
    
    // Update event registered count
    setEvents(prev => prev.map(event =>
      event.id === registrationData.eventId
        ? { ...event, registeredCount: event.registeredCount + 1 }
        : event
    ));
  }, []);

  const getEventRegistrations = useCallback((eventId: string) => {
    return registrations.filter(reg => reg.eventId === eventId);
  }, [registrations]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  }, []);

  const addNotification = useCallback((notifData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notifData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      notifications,
      addEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      getEventRegistrations,
      markNotificationRead,
      addNotification,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
};
