import { format } from 'date-fns';

export const scheduleData = [
  {
    id: 1,
    date: '2024-12-16',
    timeSlot: '8:00 AM - 2:00 PM',
    school: 'Lincoln High School',
    subject: 'mathematics',
    grade: '10th Grade',
    location: '204',
    status: 'confirmed',
    teacher: 'Sarah Johnson',
    notes: 'Regular algebra class, lesson plan available'
  },
  {
    id: 2,
    date: '2024-12-16',
    timeSlot: '9:45 AM - 11:15 AM',
    school: 'Washington Middle School',
    subject: 'science',
    grade: '8th Grade',
    location: 'Lab 101',
    status: 'confirmed',
    teacher: 'Michael Brown',
    notes: 'Chemistry lab session'
  },
  {
    id: 3,
    date: '2024-12-20',
    timeSlot: '1:30 PM - 3:00 PM',
    school: 'Roosevelt Elementary',
    subject: 'english',
    grade: '5th Grade',
    location: '105',
    status: 'confirmed',
    teacher: 'Emily Davis',
    notes: 'Reading comprehension class'
  },
  {
    id: 4,
    date: '2024-12-20',
    timeSlot: '8:00 AM - 9:30 AM',
    school: 'Jefferson High School',
    subject: 'mathematics',
    grade: '11th Grade',
    location: '302',
    status: 'confirmed',
    teacher: 'David Wilson',
    notes: 'Calculus class'
  },
  {
    id: 5,
    date: format(new Date(), 'yyyy-MM-dd'), // Today
    timeSlot: '11:30 AM - 1:00 PM',
    school: 'Lincoln High School',
    subject: 'science',
    grade: '9th Grade',
    location: 'Lab 203',
    status: 'confirmed',
    teacher: 'Lisa Anderson',
    notes: 'Biology lab session'
  },
  {
    id: 6,
    date: format(new Date(), 'yyyy-MM-dd'), // Today
    timeSlot: '2:00 PM - 3:30 PM',
    school: 'Central High School',
    subject: 'physics',
    grade: '12th Grade',
    location: 'Lab 405',
    status: 'confirmed',
    teacher: 'Robert Taylor',
    notes: 'Physics lab experiment'
  },
  {
    id: 7,
    date: '2024-12-16',
    timeSlot: '1:00 PM - 2:30 PM',
    school: 'Madison Elementary',
    subject: 'mathematics',
    grade: '4th Grade',
    location: '108',
    status: 'confirmed',
    teacher: 'Jennifer White',
    notes: 'Basic arithmetic class'
  },
  {
    id: 8,
    date: '2024-12-20',
    timeSlot: '10:00 AM - 11:30 AM',
    school: 'Franklin Middle School',
    subject: 'history',
    grade: '7th Grade',
    location: '201',
    status: 'confirmed',
    teacher: 'Thomas Brown',
    notes: 'World History class'
  }
]; 