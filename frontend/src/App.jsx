import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Fees from './pages/Fees';
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';
import FacultyDashboard from './pages/FacultyDashboard';
import ViewStudents from './pages/ViewStudents';
import MarkAttendance from './pages/MarkAttendance';
import EnterMarks from './pages/EnterMarks';
import useAuthStore from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={useAuthStore.getState().user?.role === 'faculty' ? '/faculty/dashboard' : '/dashboard'} />
            ) : (
              <Login />
            )
          }
        />
        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marks"
          element={
            <ProtectedRoute>
              <Marks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fees"
          element={
            <ProtectedRoute>
              <Fees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <Timetable />
            </ProtectedRoute>
          }
        />

        {/* Faculty Protected Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/students"
          element={
            <ProtectedRoute>
              <ViewStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/attendance"
          element={
            <ProtectedRoute>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/marks"
          element={
            <ProtectedRoute>
              <EnterMarks />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;