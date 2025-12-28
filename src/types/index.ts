export type UserRole = 'student' | 'admin';

export type ClubType = 'dance' | 'podcast' | 'radio' | 'music' | 'sports' | 'cultural' | 'technical' | 'literary';

export type Branch = 'CSE' | 'AIML' | 'AIDS' | 'IT' | 'ECE' | 'CIVIL' | 'MECH' | 'EEE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branch?: Branch;
  phone?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  club: ClubType;
  clubName: string;
  date: Date;
  time: string;
  venue: string;
  leaderName: string;
  leaderPhone: string;
  imageUrl: string;
  maxParticipants?: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  branch: Branch;
  email: string;
  phone: string;
  rollNumber: string;
  year: string;
  registeredAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  eventId?: string;
  createdAt: Date;
  isRead: boolean;
}
