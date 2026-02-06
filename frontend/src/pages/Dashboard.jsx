import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  Calendar, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Award,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { studentAPI } from '../services/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Real data states
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [feesData, setFeesData] = useState(null);
  const [timetableData, setTimetableData] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [attendance, marks, fees, timetable] = await Promise.all([
        studentAPI.getAttendance(),
        studentAPI.getInternalMarks(),
        studentAPI.getFees(),
        studentAPI.getTimetable(),
      ]);

      // Safe data extraction with proper checks
      const attendanceDataRaw = attendance?.data?.data;
      const marksDataRaw = marks?.data?.data;
      
      // Handle attendance data - check if it's array or object with subjectWise
      if (Array.isArray(attendanceDataRaw)) {
        setAttendanceData(attendanceDataRaw);
      } else if (attendanceDataRaw?.subjectWise && Array.isArray(attendanceDataRaw.subjectWise)) {
        setAttendanceData(attendanceDataRaw.subjectWise);
      } else {
        setAttendanceData([]);
      }

      // Handle marks data
      if (Array.isArray(marksDataRaw)) {
        setMarksData(marksDataRaw);
      } else if (marksDataRaw?.subjects && Array.isArray(marksDataRaw.subjects)) {
        setMarksData(marksDataRaw.subjects);
      } else {
        setMarksData([]);
      }

      setFeesData(fees?.data?.data || null);
      setTimetableData(timetable?.data?.data || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent crashes
      setAttendanceData([]);
      setMarksData([]);
      setFeesData(null);
      setTimetableData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallAttendance = () => {
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) return '0';
    const total = attendanceData.reduce((sum, item) => sum + (item.percentage || 0), 0);
    return (total / attendanceData.length).toFixed(1);
  };

  const calculateCGPA = () => {
    if (!Array.isArray(marksData) || marksData.length === 0) return '0.0';
    const total = marksData.reduce((sum, item) => sum + (item.internalMarks?.totalInternal || 0), 0);
    const average = total / marksData.length;
    return ((average / 50) * 10).toFixed(1);
  };

  const getPendingFees = () => {
    if (!feesData) return 0;
    return feesData.paymentDetails?.amountPending || 0;
  };

  const overallAttendance = calculateOverallAttendance();
  const currentCGPA = calculateCGPA();
  const pendingFees = getPendingFees();

  // Stats Data - REAL VALUES
  const stats = [
    {
      name: 'Overall Attendance',
      value: `${overallAttendance}%`,
      change: parseFloat(overallAttendance) >= 75 ? '+Good' : 'Below 75%',
      trend: parseFloat(overallAttendance) >= 75 ? 'up' : 'down',
      icon: Calendar,
      color: 'blue',
      bgGradient: 'from-blue-600/10 to-blue-700/10',
      iconBg: 'from-blue-600 to-blue-700',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Current CGPA',
      value: currentCGPA,
      change: parseFloat(currentCGPA) >= 8.0 ? '+Excellent' : 'Average',
      trend: parseFloat(currentCGPA) >= 8.0 ? 'up' : 'neutral',
      icon: Award,
      color: 'green',
      bgGradient: 'from-green-600/10 to-green-700/10',
      iconBg: 'from-green-600 to-green-700',
      borderColor: 'border-green-500/20',
    },
    {
      name: 'Pending Fees',
      value: `₹${pendingFees.toLocaleString()}`,
      change: pendingFees === 0 ? 'Fully Paid' : 'Payment Due',
      trend: pendingFees === 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'yellow',
      bgGradient: 'from-yellow-600/10 to-yellow-700/10',
      iconBg: 'from-yellow-600 to-yellow-700',
      borderColor: 'border-yellow-500/20',
    },
    {
      name: 'Total Subjects',
      value: attendanceData.length,
      change: 'Active',
      trend: 'neutral',
      icon: BookOpen,
      color: 'purple',
      bgGradient: 'from-purple-600/10 to-purple-700/10',
      iconBg: 'from-purple-600 to-purple-700',
      borderColor: 'border-purple-500/20',
    },
  ];

  // Attendance Trend - REAL DATA with safe slice
  const attendanceTrend = Array.isArray(attendanceData) 
    ? attendanceData.slice(0, 6).map(item => ({
        subject: item.subjectCode || item.subjectName || 'Unknown',
        attendance: item.percentage || 0,
      }))
    : [];

  // CGPA Trend - REAL DATA (showing internal marks trend) with safe slice
  const cgpaTrend = Array.isArray(marksData)
    ? marksData.slice(0, 5).map((item, index) => ({
        sem: item.subjectCode || item.subjectName || `Subject ${index + 1}`,
        marks: item.internalMarks?.totalInternal || 0,
      }))
    : [];

  // Subject Performance - REAL DATA
  const excellent = attendanceData.filter(a => a.percentage >= 85).length;
  const good = attendanceData.filter(a => a.percentage >= 75 && a.percentage < 85).length;
  const average = attendanceData.filter(a => a.percentage < 75).length;

  const subjectPerformance = [
    { name: 'Excellent', value: excellent, color: '#10b981' },
    { name: 'Good', value: good, color: '#3b82f6' },
    { name: 'Average', value: average, color: '#f59e0b' },
  ].filter(item => item.value > 0); // Only show categories with values

  // Recent Activity - REAL DATA with safe slice
  const recentActivity = Array.isArray(attendanceData)
    ? attendanceData.slice(0, 4).map(item => ({
        type: 'attendance',
        subject: item.subjectName || item.subject || 'Unknown',
        status: item.percentage >= 75 ? 'Good Attendance' : 'Low Attendance',
        time: 'Recent',
        icon: item.percentage >= 75 ? CheckCircle2 : XCircle,
        color: item.percentage >= 75 ? 'text-green-400' : 'text-red-400',
      }))
    : [];

  // Today's Schedule - REAL DATA from timetable with safe access
  const todaySchedule = (timetableData?.schedule?.[0]?.periods || [])
    .filter(period => period.type !== 'Break')
    .slice(0, 3)
    .map(period => ({
      time: period.startTime || 'TBA',
      subject: period.subject || 'Unknown',
      room: period.roomNumber || 'TBA',
      type: period.type || 'Class',
    }));

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
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 border border-blue-500/30 shadow-2xl shadow-blue-600/20">
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards - REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor} hover:shadow-xl transition-all duration-300 group hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
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

        {/* Charts Row - REAL DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          {attendanceTrend.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Subject Attendance
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="subject" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="attendance" stroke="#0d6efd" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Performance Distribution */}
          {subjectPerformance.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                Attendance Performance
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
          )}
        </div>

        {/* Recent Activity - REAL DATA */}
        {recentActivity.length > 0 && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
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
                      <p className="font-medium text-white">{activity.subject}</p>
                      <p className="text-sm text-gray-400">{activity.status}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Today's Schedule - REAL DATA */}
        {todaySchedule.length > 0 && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {attendanceData.length === 0 && marksData.length === 0 && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-12 border border-gray-800 shadow-xl text-center">
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
            <p className="text-gray-400">Your academic data will appear here once available.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
