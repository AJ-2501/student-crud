import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import NotificationBanner from './components/NotificationBanner';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './api/studentService';
import { ServerOff } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [serverError, setServerError] = useState(false);

  // Helper to show auto-expiring notifications
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
  }, []);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Load all students
  const loadStudents = useCallback(async (isRefresh = false) => {
    setIsLoading(true);
    setServerError(false);
    try {
      const data = await getStudents();
      // Handle both array and iterable
      const studentList = Array.isArray(data) ? data : [];
      setStudents(studentList);
      if (isRefresh) {
        showNotification('Student directory refreshed', 'info');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setServerError(true);
      showNotification(
        'Unable to connect to the Student API backend (http://localhost:8080). Please ensure your Spring Boot server is running.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle Save (Create or Update)
  const handleSaveStudent = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent && editingStudent.id) {
        // Update existing
        const updated = await updateStudent(editingStudent.id, formData);
        setStudents((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setEditingStudent(null);
        showNotification(
          `Student "${updated.firstname} ${updated.lastname}" updated successfully!`,
          'success'
        );
      } else {
        // Create new
        const created = await createStudent(formData);
        setStudents((prev) => [...prev, created]);
        showNotification(
          `Student "${created.firstname} ${created.lastname}" registered successfully!`,
          'success'
        );
      }
    } catch (err) {
      console.error('Error saving student:', err);
      showNotification(err.message || 'Failed to save student details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit selection
  const handleSelectEdit = (student) => {
    setEditingStudent(student);
    // Smooth scroll to top on mobile so the form is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Handle Inline Delete
  const handleDeleteStudent = async (id) => {
    setDeletingId(id);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      showNotification(`Student #${id} deleted successfully.`, 'success');
    } catch (err) {
      console.error('Error deleting student:', err);
      showNotification(err.message || `Failed to delete student #${id}.`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        totalStudents={students.length}
        onRefresh={() => loadStudents(true)}
        isLoading={isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationBanner
          notification={notification}
          onDismiss={() => setNotification(null)}
        />

        {serverError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold">Backend Connection Note</p>
              <p className="mt-0.5 text-xs text-amber-700">
                The frontend proxies requests to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">http://localhost:8080/cruz/students</code>.
                Make sure your Spring Boot application is started (`./mvnw spring-boot:run` or via your IDE).
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout (No Modals) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Card (Create & Edit) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <StudentForm
              editingStudent={editingStudent}
              onSave={handleSaveStudent}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Student Table */}
          <div className="lg:col-span-8">
            <StudentTable
              students={students}
              isLoading={isLoading}
              editingStudentId={editingStudent ? editingStudent.id : null}
              onEdit={handleSelectEdit}
              onDelete={handleDeleteStudent}
              deletingId={deletingId}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Student CRUD System &bull; Spring Boot REST API + Vite React &bull; Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
