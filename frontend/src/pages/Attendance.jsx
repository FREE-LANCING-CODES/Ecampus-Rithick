import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview'); // overview, subjects, analytics

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance();
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance stats
  const getAttendanceStats = () => {
    if (!attendance?.subjectWise) return { excellent: 0, good: 0, warning: 0, critical: 0 };
    
    const stats = {
      excellent: 0, // >= 90%
      good: 0,      // 75-89%
      warning: 0,   // 65-74%
      critical: 0   // < 65%
    };

    attendance.subjectWise.forEach(subject => {
      if (subject.percentage >= 90) stats.excellent++;
      else if (subject.percentage >= 75) stats.good++;
      else if (subject.percentage >= 65) stats.warning++;
      else stats.critical++;
    });

    return stats;
  };

  // Prepare chart data
  const getPieChartData = () => {
    const stats = getAttendanceStats();
    return [
      { name: 'Excellent (≥90%)', value: stats.excellent, color: '#10b981' },
      { name: 'Good (75-89%)', value: stats.good, color: '#3b82f6' },
      { name: 'Warning (65-74%)', value: stats.warning, color: '#f59e0b' },
      { name: 'Critical (<65%)', value: stats.critical, color: '#ef4444' },
    ].filter(item => item.value > 0);
  };

  // Get attendance trend (mock data - replace with actual API data)
  const getAttendanceTrend = () => {
    return [
      { month: 'Jan', percentage: 85 },
      { month: 'Feb', percentage: 87 },
      { month: 'Mar', percentage: 84 },
      { month: 'Apr', percentage: 86 },
      { month: 'May', percentage: attendance?.overall?.percentage || 87 },
    ];
  };

  const stats = getAttendanceStats();

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
        {/* Header with Navigation */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Calendar className="w-10 h-10" />
                  Attendance Dashboard
                </h1>
                <p className="text-blue-100 text-lg">
                  Track and monitor your attendance records
                </p>
              </div>
              
              {/* View Tabs */}
              <div className="flex gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-xl border border-white/20">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    selectedView === 'overview'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedView('subjects')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    selectedView === 'subjects'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Subjects
                </button>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    selectedView === 'analytics'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Attendance */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{attendance?.overall?.percentage || 0}%</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Overall Attendance</p>
            <p className="text-blue-300 text-xs">
              {attendance?.overall?.attended || 0} / {attendance?.overall?.totalClasses || 0} classes
            </p>
          </div>

          {/* Excellent */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{stats.excellent}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Excellent (≥90%)</p>
            <p className="text-green-300 text-xs">Outstanding performance</p>
          </div>

          {/* Good */}
          <div className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 to-sky-600/10 backdrop-blur-xl rounded-2xl p-6 border border-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{stats.good}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Good (75-89%)</p>
            <p className="text-sky-300 text-xs">Above minimum requirement</p>
          </div>

          {/* Warning/Critical */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{stats.warning + stats.critical}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Needs Attention</p>
            <p className="text-red-300 text-xs">Below 75% threshold</p>
          </div>
        </div>

        {/* Content Based on Selected View */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Trend Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Attendance Trend
                </h3>
                <span className="text-sm text-gray-400">Last 5 Months</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={getAttendanceTrend()}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151', 
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', r: 5 }} 
                    activeDot={{ r: 7 }} 
                    fill="url(#colorTrend)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Pie Chart */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <PieChartIcon className="w-6 h-6 text-purple-500" />
                Distribution
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {getPieChartData().map((item, index) => (
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
          </div>
        )}

        {/* Subject-wise Attendance */}
        {(selectedView === 'subjects' || selectedView === 'overview') && (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-blue-500" />
                Subject-wise Attendance
              </h2>
              <p className="text-gray-400 text-sm mt-1">Detailed breakdown by subject</p>
            </div>
            <div className="p-6">
              {attendance?.subjectWise?.length > 0 ? (
                <div className="space-y-4">
                  {attendance.subjectWise.map((subject, index) => {
                    const getStatusColor = (percentage) => {
                      if (percentage >= 90) return { bg: 'from-green-500 to-green-600', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-400' };
                      if (percentage >= 75) return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400' };
                      if (percentage >= 65) return { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400' };
                      return { bg: 'from-red-500 to-red-600', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' };
                    };

                    const status = getStatusColor(subject.percentage);

                    return (
                      <div
                        key={index}
                        className={`bg-gray-800/50 border ${status.border} rounded-xl p-6 hover:border-gray-600 transition-all group hover:shadow-lg`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-white text-lg">{subject.subjectName}</h3>
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${status.badge}`}>
                                {subject.percentage >= 90 ? 'Excellent' : 
                                 subject.percentage >= 75 ? 'Good' : 
                                 subject.percentage >= 65 ? 'Warning' : 'Critical'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                {subject.subjectCode}
                              </span>
                              <span>•</span>
                              <span>{subject.attended} attended / {subject.totalClasses} total</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-4xl font-bold ${status.text}`}>
                              {subject.percentage}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {subject.totalClasses - subject.attended} absent
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${status.bg} shadow-lg`}
                            style={{ width: `${subject.percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Warning Messages */}
                        {subject.percentage < 75 && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                              <AlertCircle className="w-5 h-5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold">Attendance below 75% - Action required!</p>
                                <p className="text-xs text-red-300 mt-1">
                                  Attend next {Math.ceil((75 * subject.totalClasses - subject.attended * 100) / 25)} classes to reach 75%
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {subject.percentage >= 90 && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-4 py-3 rounded-lg border border-green-500/20">
                            <Award className="w-5 h-5" />
                            <span className="font-semibold">Outstanding attendance! Keep it up! 🎉</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-block p-6 bg-gray-800/50 rounded-full mb-4">
                    <Calendar className="w-16 h-16 text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-xl font-semibold">No attendance records found</p>
                  <p className="text-gray-600 text-sm mt-2">Your attendance will appear here once marked</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {selectedView === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Subject Comparison */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Subject Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendance?.subjectWise || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="subjectCode" 
                    stroke="#9ca3af"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151', 
                      borderRadius: '12px' 
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {attendance?.subjectWise?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.percentage >= 90 ? '#10b981' :
                          entry.percentage >= 75 ? '#3b82f6' :
                          entry.percentage >= 65 ? '#f59e0b' : '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insights & Recommendations */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-purple-500" />
                Insights & Tips
              </h3>
              <div className="space-y-4">
                {/* Overall Status */}
                <div className={`p-4 rounded-xl border ${
                  (attendance?.overall?.percentage || 0) >= 75 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex items-start gap-3">
                    {(attendance?.overall?.percentage || 0) >= 75 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        (attendance?.overall?.percentage || 0) >= 75 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        Overall Status
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {(attendance?.overall?.percentage || 0) >= 75 
                          ? 'You meet the minimum attendance requirement of 75%' 
                          : 'Your attendance is below the required 75% threshold'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Best Performing */}
                {attendance?.subjectWise?.length > 0 && (
                  <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-400">Best Performance</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {[...attendance.subjectWise].sort((a, b) => b.percentage - a.percentage)[0]?.subjectName} 
                          {' '}({[...attendance.subjectWise].sort((a, b) => b.percentage - a.percentage)[0]?.percentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Needs Improvement */}
                {attendance?.subjectWise?.some(s => s.percentage < 75) && (
                  <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-400">Needs Attention</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {attendance.subjectWise.filter(s => s.percentage < 75).length} subject(s) below 75%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-400">Pro Tips</p>
                      <ul className="text-sm text-gray-400 mt-2 space-y-1.5">
                        <li>• Maintain at least 75% to avoid academic issues</li>
                        <li>• Set reminders for important classes</li>
                        <li>• Track your attendance weekly</li>
                        <li>• Communicate with faculty for genuine reasons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 backdrop-blur-xl rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">View Timetable</p>
                <p className="text-xs text-gray-400">Check your class schedule</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 backdrop-blur-xl rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Request Leave</p>
                <p className="text-xs text-gray-400">Apply for leave of absence</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-xl rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Download Report</p>
                <p className="text-xs text-gray-400">Export attendance data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
