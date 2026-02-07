import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  DollarSign,
  Clock,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  User,
  Users,
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Marks', path: '/marks', icon: BookOpen },
    { name: 'Fee Details', path: '/fees', icon: DollarSign },
    { name: 'Timetable', path: '/timetable', icon: Clock },
  ];

  const facultyMenuItems = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/faculty/students', icon: User },
    { name: 'Mark Attendance', path: '/faculty/attendance', icon: Calendar },
    { name: 'Enter Marks', path: '/faculty/marks', icon: BookOpen },
  ];

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Manage Faculty', path: '/admin/faculty', icon: User },
  ];

  const menuItems = 
    user?.role === 'admin' ? adminMenuItems :
    user?.role === 'faculty' ? facultyMenuItems : 
    studentMenuItems;

  // Theme colors based on role
  const getThemeColors = () => {
    if (user?.role === 'admin') {
      return {
        cardBg: 'from-red-600/20 to-orange-600/20',
        cardBorder: 'border-red-500/30',
        avatarBg: 'from-red-600 to-orange-600',
        avatarShadow: 'shadow-red-500/50',
        activeMenu: 'from-red-600 to-orange-600',
        activeShadow: 'shadow-red-500/50',
      };
    } else if (user?.role === 'faculty') {
      return {
        cardBg: 'from-purple-600/20 to-purple-700/20',
        cardBorder: 'border-purple-500/30',
        avatarBg: 'from-purple-600 to-purple-700',
        avatarShadow: 'shadow-purple-500/50',
        activeMenu: 'from-purple-600 to-purple-700',
        activeShadow: 'shadow-purple-500/50',
      };
    } else {
      return {
        cardBg: 'from-blue-600/20 to-blue-700/20',
        cardBorder: 'border-blue-500/30',
        avatarBg: 'from-blue-600 to-blue-700',
        avatarShadow: 'shadow-blue-500/50',
        activeMenu: 'from-blue-600 to-blue-700',
        activeShadow: 'shadow-blue-500/50',
      };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-900 border-r border-gray-800 w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/50">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              e<span className="text-blue-500">Campus</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br ${theme.cardBg} border ${theme.cardBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-lg ${theme.avatarShadow}`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.userId}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              {user?.department} • {user?.role === 'admin' ? 'Administrator' : `Year ${user?.year} • Sem ${user?.semester}`}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? `bg-gradient-to-r ${theme.activeMenu} text-white shadow-lg ${theme.activeShadow}`
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-gray-900/80">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Welcome back, <span className="font-semibold text-white">{user?.name}</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-screen">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;