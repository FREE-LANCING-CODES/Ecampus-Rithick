import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Calendar, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Target,
  Activity
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Stats Data
  const stats = [
    {
      name: 'Overall Attendance',
      value: '87.5%',
      change: '+2.5%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      iconBg: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Current CGPA',
      value: '8.7',
      change: '+0.3',
      trend: 'up',
      icon: Award,
      color: 'green',
      bgGradient: 'from-green-500/10 to-green-600/10',
      iconBg: 'from-green-500 to-green-600',
      borderColor: 'border-green-500/20',
    },
    {
      name: 'Pending Fees',
      value: '₹5,000',
      change: '-₹15,000',
      trend: 'down',
      icon: DollarSign,
      color: 'yellow',
      bgGradient: 'from-yellow-500/10 to-yellow-600/10',
      iconBg: 'from-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-500/20',
    },
    {
      name: 'Total Subjects',
      value: '6',
      change: 'Active',
      trend: 'neutral',
      icon: BookOpen,
      color: 'purple',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      iconBg: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500/20',
    },
  ];

  // Attendance Trend Data (Last 7 days)
  const attendanceTrend = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 90 },
    { day: 'Wed', attendance: 82 },
    { day: 'Thu', attendance: 88 },
    { day: 'Fri', attendance: 92 },
    { day: 'Sat', attendance: 87 },
  ];

  // CGPA Trend (Semesters)
  const cgpaTrend = [
    { sem: 'Sem 1', cgpa: 8.2 },
    { sem: 'Sem 2', cgpa: 8.4 },
    { sem: 'Sem 3', cgpa: 8.5 },
    { sem: 'Sem 4', cgpa: 8.6 },
    { sem: 'Sem 5', cgpa: 8.7 },
  ];

  // Subject Performance
  const subjectPerformance = [
    { name: 'Excellent', value: 3, color: '#10b981' },
    { name: 'Good', value: 2, color: '#3b82f6' },
    { name: 'Average', value: 1, color: '#f59e0b' },
  ];

  // Recent Activity
  const recentActivity = [
    { 
      type: 'attendance', 
      subject: 'Data Structures', 
      status: 'Present', 
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-green-400'
    },
    { 
      type: 'marks', 
      subject: 'Web Development CIA-2', 
      status: '18/20 Marks', 
      time: '5 hours ago',
      icon: Award,
      color: 'text-blue-400'
    },
    { 
      type: 'attendance', 
      subject: 'DBMS', 
      status: 'Absent', 
      time: '1 day ago',
      icon: XCircle,
      color: 'text-red-400'
    },
    { 
      type: 'fee', 
      subject: 'Semester Fee Payment', 
      status: 'Completed', 
      time: '2 days ago',
      icon: DollarSign,
      color: 'text-yellow-400'
    },
  ];

  // Today's Schedule
  const todaySchedule = [
    { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 301', type: 'Lab' },
    { time: '11:00 AM', subject: 'Web Development', room: 'Room 201', type: 'Theory' },
    { time: '02:00 PM', subject: 'Computer Networks', room: 'Room 305', type: 'Theory' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
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
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's your academic overview for today
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <p className="text-blue-100 text-sm mb-1">Current Semester</p>
                    <p className="text-4xl font-bold text-white">{user?.semester}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} hover:shadow-2xl hover:shadow-${stat.color}-500/20 transition-all duration-300 group hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.iconBg} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Attendance Trend
              </h3>
              <span className="text-sm text-gray-400">Last 6 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CGPA Trend */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-500" />
                CGPA Progress
              </h3>
              <span className="text-sm text-gray-400">5 Semesters</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="sem" stroke="#9ca3af" />
                <YAxis domain={[7, 10]} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="cgpa" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-500" />
              Subject Performance
            </h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={subjectPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {subjectPerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className={`p-2 rounded-lg bg-gray-800`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{activity.subject}</p>
                      <p className="text-sm text-gray-400">{activity.status}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-green-500" />
            Today's Classes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todaySchedule.map((cls, index) => (
              <div
                key={index}
                className="relative overflow-hidden p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-blue-500/20 px-3 py-1 rounded-lg">
                    <span className="text-sm font-semibold text-blue-400">{cls.time}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    cls.type === 'Lab' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {cls.type}
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-2">{cls.subject}</h4>
                <p className="text-sm text-gray-400">{cls.room}</p>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/5 rounded-tl-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;