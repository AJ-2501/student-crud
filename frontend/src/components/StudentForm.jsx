import React, { useState, useEffect } from 'react';
import { UserPlus, Save, RotateCcw, AlertTriangle } from 'lucide-react';

const INITIAL_FORM = {
  firstname: '',
  lastname: '',
  course: '',
  section: '',
};

export default function StudentForm({ editingStudent, onSave, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(editingStudent && editingStudent.id);

  // Sync form data when an editing student is selected
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || '',
        section: editingStudent.section || '',
      });
      setErrors({});
    } else {
      setFormData(INITIAL_FORM);
      setErrors({});
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(formData);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    if (isEditMode) {
      onCancelEdit();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs ${
        isEditMode
          ? 'border-amber-300 ring-2 ring-amber-100 shadow-md'
          : 'border-slate-200'
      }`}
    >
      <div
        className={`px-6 py-4 border-b rounded-t-2xl flex items-center justify-between ${
          isEditMode ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isEditMode
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-blue-600 text-white shadow-xs'
            }`}
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isEditMode ? `Edit Student (ID: ${editingStudent.id})` : 'Register New Student'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update student details and save changes'
                : 'Fill in all fields to add to directory'}
            </p>
          </div>
        </div>

        {isEditMode && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
            Edit Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstname" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            placeholder="e.g. Maria"
            value={formData.firstname}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-hidden focus:ring-2 ${
              errors.firstname
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.firstname && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.firstname}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastname" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            placeholder="e.g. Santos"
            value={formData.lastname}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-hidden focus:ring-2 ${
              errors.lastname
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.lastname && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.lastname}
            </p>
          )}
        </div>

        {/* Course */}
        <div>
          <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Course / Degree <span className="text-rose-500">*</span>
          </label>
          <input
            id="course"
            name="course"
            type="text"
            placeholder="e.g. BS Information Technology"
            value={formData.course}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-hidden focus:ring-2 ${
              errors.course
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.course && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.course}
            </p>
          )}
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Section <span className="text-rose-500">*</span>
          </label>
          <input
            id="section"
            name="section"
            type="text"
            placeholder="e.g. 3-A"
            value={formData.section}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-hidden focus:ring-2 ${
              errors.section
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.section && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.section}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all shadow-xs disabled:opacity-60 cursor-pointer ${
              isEditMode
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-300'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'
            }`}
          >
            {isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Changes...' : 'Update Student'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Add Student'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEditMode ? 'Cancel Edit' : 'Reset'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
