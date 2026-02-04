import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  BookOpen,
  Activity,
  Filter,
  Download,
  Bell,
  ChevronRight,
  Play,
  Coffee,
  Laptop,
  GraduationCap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // week, day, list

  useEffect(() => {
    fetchTimetable();
    // Set current day as selected
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setSelectedDay(days[new Date().getDay()]);
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await studentAPI.getTimetable();
      setTimetable(response.data.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodColor = (type) => {
    switch (type) {
      case 'Theory':
        return {
          bg: 'from-blue-500/10 to-blue-600/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          icon: 'bg-blue-500/20',
          badge: 'bg-blue-500/30 text-blue-300'
        };
      case 'Lab':
        return {
          bg: 'from-purple-500/10 to-purple-600/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          icon: 'bg-purple-500/20',
          badge: 'bg-purple-500/30 text-purple-300'
        };
      case 'Tutorial':
        return {
          bg: 'from-green-500/10 to-green-600/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
          icon: 'bg-green-500/20',
          badge: 'bg-green-500/30 text-green-300'
        };
      case 'Break':
        return {
          bg: 'from-yellow-500/10 to-yellow-600/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          icon: 'bg-yellow-500/20',
          badge: 'bg-yellow-500/30 text-yellow-300'
        };
      default:
        return {
          bg: 'from-gray-500/10 to-gray-600/10',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          icon: 'bg-gray-500/20',
          badge: 'bg-gray-500/30 text-gray-300'
        };
    }
  };

  const getPeriodIcon = (type) => {
    switch (type) {
      case 'Theory':
        return BookOpen;
      case 'Lab':
        return Laptop;
      case 'Tutorial':
        return GraduationCap;
      case 'Break':
        return Coffee;
      default:
        return Clock;
    }
  };

  // Get current period
  const getCurrentPeriod = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];

    const todaySchedule = timetable?.schedule?.find(day => day.day === today);
    if (!todaySchedule) return null;

    for (const period of todaySchedule.periods) {
      const [startHour, startMin] = period.startTime.split(':').map(Number);
      const [endHour, endMin] = period.endTime.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (currentTime >= startTime && currentTime <= endTime) {
        return { ...period, day: today };
      }
    }
    return null;
  };

  const currentPeriod = getCurrentPeriod();

  // Get today's remaining classes
  const getTodayClasses = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todaySchedule = timetable?.schedule?.find(day => day.day === today);
    return todaySchedule?.periods || [];
  };

  // Statistics
  const getStats = () => {
    if (!timetable?.schedule) return { total: 0, theory: 0, lab: 0, tutorial: 0 };
    
    let total = 0, theory = 0, lab = 0, tutorial = 0;
    
    timetable.schedule.forEach(day => {
      day.periods?.forEach(period => {
        if (period.type !== 'Break') {
          total++;
          if (period.type === 'Theory') theory++;
          else if (period.type === 'Lab') lab++;
          else if (period.type === 'Tutorial') tutorial++;
        }
      });
    });

    return { total, theory, lab, tutorial };
  };

  const stats = getStats();

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
        {/* Header with View Controls */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Calendar className="w-10 h-10" />
                  Weekly Timetable
                </h1>
                <p className="text-blue-100 text-lg">
                  Your complete class schedule
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl transition-all border border-white/20 hover:scale-105">
                  <Bell className="w-4 h-4" />
                  Reminders
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold hover:scale-105 shadow-lg">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-xl border border-white/20">
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  viewMode === 'day'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                List View
              </button>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {timetable ? (
          <>
            {/* Stats & Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Timetable Info */}
              <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Class Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Department</p>
                    <p className="font-semibold text-white text-sm">{timetable.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Year & Sem</p>
                    <p className="font-semibold text-white text-sm">Y{timetable.year} - S{timetable.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Section</p>
                    <p className="font-semibold text-white text-sm">{timetable.section}</p>
                  </div>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-500/20 p-2.5 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Classes</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-purple-500/20 p-2.5 rounded-lg">
                    <Laptop className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.lab}</p>
                <p className="text-sm text-gray-400">Lab Sessions</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl p-5 border border-green-500/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-green-500/20 p-2.5 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.tutorial}</p>
                <p className="text-sm text-gray-400">Tutorials</p>
              </div>
            </div>

            {/* Current/Next Class Alert */}
            {currentPeriod && (
              <div className="bg-gradient-to-r from-green-600/20 via-green-700/20 to-blue-700/20 rounded-2xl p-6 border border-green-500/30 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/30 p-4 rounded-xl animate-pulse">
                    <Play className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-semibold text-sm mb-1">NOW LIVE</p>
                    <h3 className="text-2xl font-bold text-white mb-1">{currentPeriod.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentPeriod.startTime} - {currentPeriod.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {currentPeriod.roomNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {currentPeriod.facultyName}
                      </span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getPeriodColor(currentPeriod.type).badge}`}>
                    {currentPeriod.type}
                  </span>
                </div>
              </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="space-y-5">
                {timetable.schedule?.map((day, index) => {
                  const isToday = day.day === selectedDay;
                  return (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border backdrop-blur-xl overflow-hidden shadow-xl transition-all ${
                        isToday ? 'border-blue-500/50 shadow-blue-500/20' : 'border-gray-800'
                      }`}
                    >
                      <div className={`px-6 py-4 border-b flex items-center justify-between ${
                        isToday ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/50 border-gray-800'
                      }`}>
                        <h3 className="font-bold text-white text-xl flex items-center gap-3">
                          <Calendar className={`w-6 h-6 ${isToday ? 'text-blue-400' : 'text-gray-400'}`} />
                          {day.day}
                          {isToday && (
                            <span className="px-3 py-1 bg-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg border border-blue-400/30">
                              TODAY
                            </span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {day.periods?.filter(p => p.type !== 'Break').length} Classes
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {day.periods?.map((period, idx) => {
                            const colors = getPeriodColor(period.type);
                            const Icon = getPeriodIcon(period.type);
                            
                            return (
                              <div
                                key={idx}
                                className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-5 backdrop-blur-xl hover:scale-105 transition-all shadow-lg group`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className={`${colors.icon} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-5 h-5 ${colors.text}`} />
                                  </div>
                                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${colors.badge}`}>
                                    {period.type}
                                  </span>
                                </div>

                                <div className="mb-4">
                                  <span className="text-xs font-medium text-gray-500 bg-black/30 px-2 py-1 rounded">
                                    Period {period.periodNumber}
                                  </span>
                                </div>

                                <h4 className={`font-bold text-lg mb-1 ${colors.text}`}>
                                  {period.subject}
                                </h4>
                                <p className="text-sm text-gray-400 mb-4">{period.subjectCode}</p>

                                <div className="space-y-2.5">
                                  <div className={`flex items-center gap-2 text-sm ${colors.text}`}>
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">
                                      {period.startTime} - {period.endTime}
                                    </span>
                                  </div>

                                  {period.facultyName && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                      <User className="w-4 h-4" />
                                      <span>{period.facultyName}</span>
                                    </div>
                                  )}

                                  {period.roomNumber && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                      <MapPin className="w-4 h-4" />
                                      <span>{period.roomNumber}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="space-y-6">
                {/* Day Selector */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-4 backdrop-blur-xl">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {timetable.schedule?.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDay(day.day)}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                          selectedDay === day.day
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Day Schedule */}
                {timetable.schedule
                  ?.filter(day => day.day === selectedDay)
                  .map((day, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-xl shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Calendar className="w-7 h-7 text-blue-500" />
                        {day.day}'s Schedule
                      </h3>
                      <div className="space-y-3">
                        {day.periods?.map((period, idx) => {
                          const colors = getPeriodColor(period.type);
                          const Icon = getPeriodIcon(period.type);
                          
                          return (
                            <div
                              key={idx}
                              className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-xl p-5 hover:shadow-lg transition-all`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`${colors.icon} p-4 rounded-xl`}>
                                  <Icon className={`w-6 h-6 ${colors.text}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className={`font-bold text-xl ${colors.text}`}>
                                      {period.subject}
                                    </h4>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${colors.badge}`}>
                                      {period.type}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      {period.startTime} - {period.endTime}
                                    </span>
                                    {period.facultyName && (
                                      <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        {period.facultyName}
                                      </span>
                                    )}
                                    {period.roomNumber && (
                                      <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {period.roomNumber}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-black/30 px-3 py-1.5 rounded-lg">
                                  P{period.periodNumber}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Day</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Faculty</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {timetable.schedule?.map((day) =>
                        day.periods?.map((period, idx) => {
                          const colors = getPeriodColor(period.type);
                          return (
                            <tr key={`${day.day}-${idx}`} className="hover:bg-gray-800/30 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-white">{day.day}</td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {period.startTime} - {period.endTime}
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-semibold text-white">{period.subject}</p>
                                  <p className="text-xs text-gray-400">{period.subjectCode}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${colors.badge}`}>
                                  {period.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">{period.facultyName || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-300">{period.roomNumber || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-xl shadow-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Class Types
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'Theory', icon: BookOpen, color: 'blue' },
                  { type: 'Lab', icon: Laptop, color: 'purple' },
                  { type: 'Tutorial', icon: GraduationCap, color: 'green' },
                  { type: 'Break', icon: Coffee, color: 'yellow' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className={`flex items-center gap-3 bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-xl p-4`}>
                      <div className={`bg-${item.color}-500/20 p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${item.color}-400`} />
                      </div>
                      <span className={`text-sm font-semibold text-${item.color}-400`}>{item.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-20 text-center shadow-xl">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full mb-6">
              <Clock className="w-20 h-20 text-gray-600" />
            </div>
            <p className="text-gray-400 text-2xl font-semibold mb-2">No timetable available</p>
            <p className="text-gray-600">Your class schedule will appear here once published</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
