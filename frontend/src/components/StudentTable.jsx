import React, { useState } from 'react';
import { Search, Edit3, Trash2, Check, X, AlertTriangle, UserX, Loader2 } from 'lucide-react';

export default function StudentTable({
  students,
  isLoading,
  editingStudentId,
  onEdit,
  onDelete,
  deletingId,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${student.firstname || ''} ${student.lastname || ''}`.toLowerCase();
    const course = (student.course || '').toLowerCase();
    const section = (student.section || '').toLowerCase();
    const id = String(student.id || '');

    return (
      fullName.includes(query) ||
      course.includes(query) ||
      section.includes(query) ||
      id.includes(query)
    );
  });

  const handleStartDelete = (id) => {
    setPendingDeleteId(id);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  const handleConfirmDelete = (id) => {
    onDelete(id);
    setPendingDeleteId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header with Search and Stats */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Student Directory</h2>
          <p className="text-xs text-slate-500">
            {filteredStudents.length} of {students.length} student(s) displayed
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, course, section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-xs font-medium">Loading student records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserX className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">
                      {searchQuery ? 'No students match your search criteria' : 'No students found in the database'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {searchQuery ? 'Try adjusting your search terms' : 'Use the form to register your first student'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = editingStudentId === student.id;
                const isPendingDelete = pendingDeleteId === student.id;
                const isDeleting = deletingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-amber-50/60 hover:bg-amber-50'
                        : isPendingDelete
                        ? 'bg-rose-50/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500">
                      #{student.id}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {student.firstname} {student.lastname}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            Editing
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                        {student.course}
                      </span>
                    </td>

                    {/* Section */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {student.section}
                      </span>
                    </td>

                    {/* Actions - Inline Confirmation, No Modals */}
                    <td className="py-3.5 px-4 text-right">
                      {isPendingDelete ? (
                        <div className="inline-flex items-center gap-1.5 bg-white border border-rose-200 shadow-xs px-2 py-1 rounded-lg">
                          <span className="text-xs text-rose-700 font-semibold flex items-center gap-1 mr-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Confirm?
                          </span>
                          <button
                            onClick={() => handleConfirmDelete(student.id)}
                            disabled={isDeleting}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Yes
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" /> No
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onEdit(student)}
                            title="Edit this student"
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50 border-slate-200'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleStartDelete(student.id)}
                            disabled={isDeleting}
                            title="Delete this student"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
