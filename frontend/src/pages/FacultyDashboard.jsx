import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Clock,
  TrendingUp,
  Award,
  Activity,
  Target,
  Bell,
  BarChart3,
  PieChart as PieChartIcon,
  UserCheck,
  FileText
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { facultyAPI } from '../services/api';

const FacultyDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        facultyAPI.getStudents(),
        facultyAPI.getSubjects(),
      ]);
      setStudents(studentsRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats Data
  const stats = [
    {
      name: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'blue',
      bgGradient: 'from-blue-600/10 to-blue-700/10',
      iconBg: 'bg-blue-600',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      trend: 'Active',
    },
    {
      name: 'Classes Today',
      value: '4',
      icon: Calendar,
      color: 'green',
      bgGradient: 'from-green-600/10 to-green-700/10',
      iconBg: 'bg-green-600',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      trend: 'Scheduled',
    },
    {
      name: 'Subjects Assigned',
      value: subjects.length,
      icon: BookOpen,
      color: 'purple',
      bgGradient: 'from-purple-600/10 to-purple-700/10',
      iconBg: 'bg-purple-600',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      trend: 'This Semester',
    },
    {
      name: 'Pending Tasks',
      value: '2',
      icon: CheckSquare,
      color: 'orange',
      bgGradient: 'from-orange-600/10 to-orange-700/10',
      iconBg: 'bg-orange-600',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      trend: 'Assignments',
    },
  ];

  // Sample attendance data for chart
  const attendanceData = [
    { subject: 'DSA', attendance: 87 },
    { subject: 'Web Dev', attendance: 92 },
    { subject: 'DBMS', attendance: 85 },
    { subject: 'OS', attendance: 89 },
    { subject: 'Networks', attendance: 91 },
    { subject: 'SE', attendance: 88 },
  ];

  // Performance distribution
  const performanceData = [
    { name: 'Excellent', value: 3, color: '#10b981' },
    { name: 'Good', value: 4, color: '#0d6efd' },
    { name: 'Average', value: 2, color: '#f59e0b' },
  ];

  // Weekly activity
  const weeklyActivity = [
    { day: 'Mon', classes: 3, attendance: 85 },
    { day: 'Tue', classes: 4, attendance: 90 },
    { day: 'Wed', classes: 2, attendance: 88 },
    { day: 'Thu', classes: 3, attendance: 92 },
    { day: 'Fri', classes: 4, attendance: 87 },
    { day: 'Sat', classes: 2, attendance: 89 },
  ];

  // Today's Schedule
  const todaySchedule = [
    { time: '09:00 AM', subject: 'Data Structures & Algorithms', class: 'B.Sc CS - Year 3', room: 'Lab 301', type: 'Lab' },
    { time: '11:00 AM', subject: 'Web Development', class: 'B.Sc CS - Year 3', room: 'Room 201', type: 'Theory' },
    { time: '02:00 PM', subject: 'Database Management Systems', class: 'B.Sc CS - Year 3', room: 'Room 302', type: 'Theory' },
  ];

  // Quick Actions
  const quickActions = [
    { 
      name: 'View Students', 
      icon: Users, 
      path: '/faculty/students',
      color: 'blue',
      description: `${students.length} students enrolled`
    },
    { 
      name: 'Mark Attendance', 
      icon: UserCheck, 
      path: '/faculty/attendance',
      color: 'green',
      description: 'Record today\'s attendance'
    },
    { 
      name: 'Enter Marks', 
      icon: FileText, 
      path: '/faculty/marks',
      color: 'purple',
      description: 'Update student marks'
    },
  ];

  // Recent Activity
  const recentActivity = [
    { action: 'Marked attendance for DSA Lab', time: '2 hours ago', icon: CheckSquare, color: 'text-green-400' },
    { action: 'Updated marks for CIA-2', time: '5 hours ago', icon: Award, color: 'text-blue-400' },
    { action: 'Uploaded assignment', time: '1 day ago', icon: FileText, color: 'text-purple-400' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 border border-purple-500/30 shadow-2xl shadow-purple-600/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  Welcome, {user?.name}! 👨‍🏫
                </h1>
                <p className="text-purple-100 text-lg">
                  Faculty Dashboard - Manage your classes and students
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <p className="text-purple-100 text-sm mb-1">Active Students</p>
                    <p className="text-4xl font-bold text-white">{students.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-lg shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-sm ${stat.textColor} font-medium`}>{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = {
                blue: 'from-blue-600/10 to-blue-700/10 border-blue-500/30 hover:border-blue-500/50',
                green: 'from-green-600/10 to-green-700/10 border-green-500/30 hover:border-green-500/50',
                purple: 'from-purple-600/10 to-purple-700/10 border-purple-500/30 hover:border-purple-500/50',
              };
              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`group p-6 bg-gradient-to-br ${colors[action.color]} rounded-xl border transition-all hover:shadow-lg hover:scale-105`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-${action.color}-600/20 p-3 rounded-lg border border-${action.color}-500/30 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${action.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{action.name}</h4>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Overview */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              Subject-wise Attendance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="attendance" fill="#0d6efd" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Distribution */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-green-500" />
              Student Performance
            </h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value} students</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity & Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="classes" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 ${activity.color} mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{activity.action}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Classes */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Today's Classes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todaySchedule.map((cls, index) => (
              <div
                key={index}
                className="relative overflow-hidden p-5 bg-gradient-to-br from-purple-600/10 to-purple-700/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-purple-600/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                    <span className="text-sm font-semibold text-purple-400">{cls.time}</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    cls.type === 'Lab' 
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                      : 'bg-green-600/20 text-green-400 border-green-500/30'
                  }`}>
                    {cls.type}
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-lg">{cls.subject}</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    {cls.class}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {cls.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Subjects */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" />
            My Subjects ({subjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all hover:shadow-lg"
              >
                <h4 className="font-semibold text-white mb-2 text-lg">{subject.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{subject.code}</span>
                  <span className="text-purple-400 font-medium">{subject.credits} Credits</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{students.length} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;