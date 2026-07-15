import React, { createContext, useContext, useState, useEffect } from 'react';

const SchoolContext = createContext();

const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
};

const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const INITIAL_STUDENTS = [
  { id: uid(), name: 'Alice Johnson', email: 'alice@school.com', grade: '10', phone: '555-0101', enrolled: '2025-09-01', status: 'active' },
  { id: uid(), name: 'Bob Smith', email: 'bob@school.com', grade: '11', phone: '555-0102', enrolled: '2025-09-01', status: 'active' },
  { id: uid(), name: 'Carol White', email: 'carol@school.com', grade: '10', phone: '555-0103', enrolled: '2025-09-01', status: 'active' },
  { id: uid(), name: 'David Brown', email: 'david@school.com', grade: '12', phone: '555-0104', enrolled: '2024-09-01', status: 'active' },
  { id: uid(), name: 'Eva Martinez', email: 'eva@school.com', grade: '9', phone: '555-0105', enrolled: '2025-09-01', status: 'active' },
  { id: uid(), name: 'Frank Wilson', email: 'frank@school.com', grade: '11', phone: '555-0106', enrolled: '2024-09-01', status: 'inactive' },
];

const INITIAL_TEACHERS = [
  { id: uid(), name: 'Dr. Sarah Chen', email: 'schen@school.com', subject: 'Mathematics', phone: '555-0201', department: 'Science', status: 'active' },
  { id: uid(), name: 'Mr. James Park', email: 'jpark@school.com', subject: 'English', phone: '555-0202', department: 'Humanities', status: 'active' },
  { id: uid(), name: 'Ms. Lisa Kumar', email: 'lkumar@school.com', subject: 'Physics', phone: '555-0203', department: 'Science', status: 'active' },
  { id: uid(), name: 'Mr. Tom Davis', email: 'tdavis@school.com', subject: 'History', phone: '555-0204', department: 'Humanities', status: 'active' },
];

const INITIAL_CLASSES = [
  { id: uid(), name: 'Math 101', subject: 'Mathematics', teacherId: '', room: 'A-101', schedule: 'Mon/Wed/Fri 9:00-10:00', capacity: 30, enrolled: 28 },
  { id: uid(), name: 'English 201', subject: 'English', teacherId: '', room: 'B-202', schedule: 'Tue/Thu 10:00-11:30', capacity: 25, enrolled: 22 },
  { id: uid(), name: 'Physics 101', subject: 'Physics', teacherId: '', room: 'C-103', schedule: 'Mon/Wed 13:00-14:30', capacity: 30, enrolled: 26 },
  { id: uid(), name: 'History 101', subject: 'History', teacherId: '', room: 'A-102', schedule: 'Tue/Thu 14:00-15:30', capacity: 35, enrolled: 30 },
];

const INITIAL_GRADES = [
  { id: uid(), studentId: '', subject: 'Mathematics', assessment: 'Midterm Exam', score: 88, maxScore: 100, date: '2026-03-15', term: 'Spring 2026' },
  { id: uid(), studentId: '', subject: 'English', assessment: 'Essay 1', score: 92, maxScore: 100, date: '2026-03-20', term: 'Spring 2026' },
  { id: uid(), studentId: '', subject: 'Physics', assessment: 'Lab Report', score: 85, maxScore: 100, date: '2026-04-01', term: 'Spring 2026' },
];

const INITIAL_ATTENDANCE = [
  { id: uid(), studentId: '', date: '2026-07-10', status: 'present', classId: '' },
  { id: uid(), studentId: '', date: '2026-07-10', status: 'absent', classId: '' },
  { id: uid(), studentId: '', date: '2026-07-10', status: 'present', classId: '' },
];

const INITIAL_FEES = [
  { id: uid(), studentId: '', amount: 500, type: 'Tuition', status: 'paid', dueDate: '2026-02-01', paidDate: '2026-01-28', term: 'Spring 2026' },
  { id: uid(), studentId: '', amount: 150, type: 'Lab Fee', status: 'paid', dueDate: '2026-02-01', paidDate: '2026-01-30', term: 'Spring 2026' },
  { id: uid(), studentId: '', amount: 500, type: 'Tuition', status: 'pending', dueDate: '2026-08-01', paidDate: null, term: 'Fall 2026' },
];

export function SchoolProvider({ children }) {
  const [students, setStudents] = useState(() => load('school_students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState(() => load('school_teachers', INITIAL_TEACHERS));
  const [classes, setClasses] = useState(() => load('school_classes', INITIAL_CLASSES));
  const [grades, setGrades] = useState(() => load('school_grades', INITIAL_GRADES));
  const [attendance, setAttendance] = useState(() => load('school_attendance', INITIAL_ATTENDANCE));
  const [fees, setFees] = useState(() => load('school_fees', INITIAL_FEES));

  useEffect(() => save('school_students', students), [students]);
  useEffect(() => save('school_teachers', teachers), [teachers]);
  useEffect(() => save('school_classes', classes), [classes]);
  useEffect(() => save('school_grades', grades), [grades]);
  useEffect(() => save('school_attendance', attendance), [attendance]);
  useEffect(() => save('school_fees', fees), [fees]);

  const crud = (setter) => ({
    add: (item) => setter((prev) => [...prev, { ...item, id: uid() }]),
    update: (id, updates) => setter((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i))),
    remove: (id) => setter((prev) => prev.filter((i) => i.id !== id)),
  });

  const value = {
    students, ...crud(setStudents),
    teachers, ...crud(setTeachers),
    classes, ...crud(setClasses),
    grades, ...crud(setGrades),
    attendance, ...crud(setAttendance),
    fees, ...crud(setFees),
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export const useSchool = () => useContext(SchoolContext);
