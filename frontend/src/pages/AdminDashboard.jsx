import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  GraduationCap,
  Activity,
  TrendingUp,
  Shield,
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

  const statsCards = [
    {
      name: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
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
      bgGradient: 'from-orange-600/10 to-orange-700/10',
      iconBg: 'bg-orange-600',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      trend: 'Operational',
    },
  ];

  const studentsByYear = stats?.studentsByYear?.map(item => ({
    year: `Year ${item._id}`,
    students: item.count,
  })) || [];

  const performanceData = [
    { name: 'Students', value: stats?.totalStudents || 0, color: '#3b82f6' },
    { name: 'Faculty', value: stats?.totalFaculty || 0, color: '#8b5cf6' },
  ];

  const quickActions = [
    { 
      name: 'Manage Students', 
      icon: Users, 
      path: '/admin/students',
      color: 'blue',
      description: `${stats?.totalStudents || 0} students`
    },
    { 
      name: 'Manage Faculty', 
      icon: UserCheck, 
      path: '/admin/faculty',
      color: 'purple',
      description: `${stats?.totalFaculty || 0} faculty`
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 border border-red-500/30 shadow-2xl shadow-red-600/20">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}! 👑</h1>
              <p className="text-red-100 text-lg">Admin Dashboard - Manage your institution</p>
            </div>
            <div className="hidden lg:block bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <p className="text-red-100 text-sm mb-1">Total Users</p>
              <p className="text-4xl font-bold text-white">{(stats?.totalStudents || 0) + (stats?.totalFaculty || 0)}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor} hover:shadow-xl transition-all hover:scale-105`}>
                <div className={`${stat.iconBg} p-3 rounded-lg shadow-lg w-fit mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path} className={`group p-6 bg-gradient-to-br from-${action.color}-600/10 to-${action.color}-700/10 rounded-xl border border-${action.color}-500/30 hover:border-${action.color}-500/50 transition-all hover:shadow-lg hover:scale-105`}>
                  <div className="flex items-start gap-4">
                    <div className={`bg-${action.color}-600/20 p-3 rounded-lg border border-${action.color}-500/30 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${action.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{action.name}</h4>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studentsByYear.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Students by Year</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studentsByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">User Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={performanceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {performanceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;