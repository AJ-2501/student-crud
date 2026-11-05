/**
 * Resolve the backend endpoint based on environment
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    const withoutProto = clean.replace(/^https?:\/\//i, '');

    // Handle Render short service host (e.g., "student-backend")
    if (!withoutProto.includes('.') && !withoutProto.includes('localhost')) {
      const hostOnly = withoutProto.split(':')[0];
      clean = `https://${hostOnly}.onrender.com`;
    } else if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }

    return `${clean}/cruz/students`;
  }

  // Default to relative path (uses Vite dev proxy in local development)
  return '/cruz/students';
}

/**
 * Fetch all students from backend
 */
export async function getStudents() {
  const url = getApiBaseUrl();
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch students (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(id) {
  const url = `${getApiBaseUrl()}/${id}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Student #${id} not found (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Create a new student
 */
export async function createStudent(studentData) {
  const url = getApiBaseUrl();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      firstname: studentData.firstname.trim(),
      lastname: studentData.lastname.trim(),
      course: studentData.course.trim(),
      section: studentData.section.trim(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create student (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Update an existing student
 */
export async function updateStudent(id, studentData) {
  const url = `${getApiBaseUrl()}/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      firstname: studentData.firstname.trim(),
      lastname: studentData.lastname.trim(),
      course: studentData.course.trim(),
      section: studentData.section.trim(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update student (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Delete a student by ID
 */
export async function deleteStudent(id) {
  const url = `${getApiBaseUrl()}/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to delete student (Status: ${response.status})`);
  }
  return response.text();
}
