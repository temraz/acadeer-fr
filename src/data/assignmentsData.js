import { format } from 'date-fns';

export const assignmentsData = [
  {
    id: 1,
    school: 'Lincoln High School',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: '8:00 AM - 2:00 PM',
    subject: 'mathematics',
    grade: '10th Grade',
    location: '204',
    status: 'upcoming',
    teacher: 'Sarah Johnson',
    notes: 'Regular algebra class, lesson plan available',
    payment: {
      amount: 120,
      status: 'pending'
    }
  },
  {
    id: 2,
    school: 'Washington Middle School',
    date: '2024-12-15',
    timeSlot: '9:45 AM - 11:15 AM',
    subject: 'science',
    grade: '8th Grade',
    location: 'Lab 101',
    status: 'completed',
    teacher: 'Michael Brown',
    notes: 'Chemistry lab session',
    payment: {
      amount: 80,
      status: 'paid'
    }
  },
  {
    id: 3,
    school: 'Roosevelt Elementary',
    date: '2024-12-18',
    timeSlot: '1:30 PM - 3:00 PM',
    subject: 'english',
    grade: '5th Grade',
    location: '105',
    status: 'cancelled',
    teacher: 'Emily Davis',
    notes: 'Reading comprehension class',
    payment: {
      amount: 90,
      status: 'cancelled'
    }
  }
]; 