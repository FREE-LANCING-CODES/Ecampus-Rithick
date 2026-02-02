import axios from 'axios';

// Base URL - Backend API
const API_BASE_URL = 'https://ecampus-rithick.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
// Faculty APIs
export const facultyAPI = {
  getStudents: () => api.get('/faculty/students'),
  getSubjects: () => api.get('/faculty/subjects'),
  markAttendance: (data) => api.post('/faculty/attendance', data),
  getAttendanceBySubject: (subjectCode, date) =>
    api.get(`/faculty/attendance/${subjectCode}${date ? `?date=${date}` : ''}`),
  enterMarks: (data) => api.post('/faculty/marks', data),
  getMarksBySubject: (subjectCode) => api.get(`/faculty/marks/${subjectCode}`),
};

export default api;