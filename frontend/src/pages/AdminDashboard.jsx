import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  GraduationCap,
  Activity,
  TrendingUp,
  Award,
  Shield,
  Settings
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Stats cards data
  const statsCards = [
    {
      name: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'blue',
      bgGradient: 'from-blue-600/10 to-blue-700/10',
      iconBg: 'bg-blue-600',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      trend: `${stats?.activeStudents || 0} Active`,
    },
    {
      name: 'Total Faculty',
      value: stats?.totalFaculty || 0,
      icon: UserCheck,
      color: 'purple',
      bgGradient: 'from-purple-600/10 to-purple-700/10',
      iconBg: 'bg-purple-600',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      trend: `${stats?.activeFaculty || 0} Active`,
    },
    {
      name: 'Active Students',
      value: stats?.activeStudents || 0,
      icon: GraduationCap,
      color: 'green',
      bgGradient: 'from-green-600/10 to-green-700/10',
      iconBg: 'bg-green-600',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      trend: 'Enrolled',
    },
    {
      name: 'System Status',
      value: 'Active',
      icon: Shield,
      color: 'orange',
      bgGradient: 'from-orange-600/10 to-orange-700/10',
      iconBg: 'bg-orange-600',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      trend: 'All Systems Operational',
    },
  ];

  // Students by year chart data
  const studentsByYear = stats?.studentsByYear?.map(item => ({
    year: `Year ${item._id}`,
    students: item.count,
  })) || [];

  // Performance data
  const performanceData = [
    { name: 'Students', value: stats?.totalStudents || 0, color: '#3b82f6' },
    { name: 'Faculty', value: stats?.totalFaculty || 0, color: '#8b5cf6' },
  ];

  // Quick actions
  const quickActions = [
    { 
      name: 'Manage Students', 
      icon: Users, 
      path: '/admin/students',
      color: 'blue',
      description: `${stats?.totalStudents || 0} students enrolled`
    },
    { 
      name: 'Manage Faculty', 
      icon: UserCheck, 
      path: '/admin/faculty',
      color: 'purple',
      description: `${stats?.totalFaculty || 0} faculty members`
    },
    { 
      name: 'System Settings', 
      icon: Settings, 
      path: '/admin/settings',
      color: 'orange',
      description: 'Configure system'
    },
  ];

  // Recent activity (mock data)
  const recentActivity = [
    { action: 'New student registered', time: '2 hours ago', icon: Users, color: 'text-blue-400' },
    { action: 'Faculty attendance updated', time: '5 hours ago', icon: Activity, color: 'text-purple-400' },
    { action: 'Marks entry completed', time: '1 day ago', icon: Award, color: 'text-green-400' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 border border-red-500/30 shadow-2xl shadow-red-600/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  Welcome, {user?.name}! 👑
                </h1>
                <p className="text-red-100 text-lg">
                  Admin Dashboard - Manage your institution
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <p className="text-red-100 text-sm mb-1">Total Users</p>
                    <p className="text-4xl font-bold text-white">{(stats?.totalStudents || 0) + (stats?.totalFaculty || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
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
            <TrendingUp className="w-6 h-6 text-red-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = {
                blue: 'from-blue-600/10 to-blue-700/10 border-blue-500/30 hover:border-blue-500/50',
                purple: 'from-purple-600/10 to-purple-700/10 border-purple-500/30 hover:border-purple-500/50',
                orange: 'from-orange-600/10 to-orange-700/10 border-orange-500/30 hover:border-orange-500/50',
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
          {/* Students by Year */}
          {studentsByYear.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Students by Year
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studentsByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* User Distribution */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-500" />
              User Distribution
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
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;