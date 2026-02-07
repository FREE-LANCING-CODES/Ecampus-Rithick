import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH APIs ============
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// ============ STUDENT APIs ============
export const studentAPI = {
  // Attendance
  getAttendance: () => api.get('/student/attendance'),
  getAttendanceBySubject: (subjectCode) => api.get(`/student/attendance/${subjectCode}`),

  // Marks
  getInternalMarks: () => api.get('/student/marks/internal'),
  getSemesterResults: () => api.get('/student/marks/semester'),
  getMarksBySemester: (semester) => api.get(`/student/marks/semester/${semester}`),

  // Fees
  getFees: () => api.get('/student/fees'),
  getFeesBySemester: (semester) => api.get(`/student/fees/${semester}`),
  getTransactions: () => api.get('/student/fees/transactions'),

  // Timetable
  getTimetable: () => api.get('/student/timetable'),
  getTodaySchedule: () => api.get('/student/timetable/today'),
  getTimetableByDay: (day) => api.get(`/student/timetable/${day}`),
};

// ============ FACULTY APIs ============
export const facultyAPI = {
  getStudents: () => api.get('/faculty/students'),
  getSubjects: () => api.get('/faculty/subjects'),
  markAttendance: (data) => api.post('/faculty/attendance', data),
  getAttendanceBySubject: (subjectCode, date) =>
    api.get(`/faculty/attendance/${subjectCode}${date ? `?date=${date}` : ''}`),
  enterMarks: (data) => api.post('/faculty/marks', data),
  getMarksBySubject: (subjectCode) => api.get(`/faculty/marks/${subjectCode}`),
};
// ============ ADMIN APIs ============
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // Students
  getStudents: () => api.get('/admin/students'),
  addStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Faculty
  getFaculty: () => api.get('/admin/faculty'),
  addFaculty: (data) => api.post('/admin/faculty', data),
  updateFaculty: (id, data) => api.put(`/admin/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/admin/faculty/${id}`),
};

export default api;