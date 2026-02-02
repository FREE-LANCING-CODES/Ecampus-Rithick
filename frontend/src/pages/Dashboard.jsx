import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Calendar, BookOpen, DollarSign, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Overall Attendance',
      value: '85%',
      icon: Calendar,
      gradient: 'from-blue-600 to-blue-700',
      shadowColor: 'shadow-blue-500/50',
    },
    {
      name: 'Current CGPA',
      value: '8.5',
      icon: TrendingUp,
      gradient: 'from-green-600 to-green-700',
      shadowColor: 'shadow-green-500/50',
    },
    {
      name: 'Pending Fees',
      value: '₹5,000',
      icon: DollarSign,
      gradient: 'from-yellow-600 to-yellow-700',
      shadowColor: 'shadow-yellow-500/50',
    },
    {
      name: 'Total Subjects',
      value: '6',
      icon: BookOpen,
      gradient: 'from-purple-600 to-purple-700',
      shadowColor: 'shadow-purple-500/50',
    },
  ];

  const recentAttendance = [
    { subject: 'Data Structures', status: 'Present', color: 'text-green-400' },
    { subject: 'Web Development', status: 'Present', color: 'text-green-400' },
    { subject: 'DBMS', status: 'Absent', color: 'text-red-400' },
  ];

  const todayClasses = [
    { subject: 'Operating Systems', room: 'Lab 301', time: '10:00 AM' },
    { subject: 'Computer Networks', room: 'CSE Block', time: '2:00 PM' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/20">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100">
            Here's what's happening with your academics today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all group backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Attendance */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Recent Attendance
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentAttendance.map((record, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  <span className="text-gray-300 font-medium">{record.subject}</span>
                  <span className={`font-semibold ${record.color}`}>{record.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Today's Classes
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {todayClasses.map((cls, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  <div>
                    <p className="font-medium text-white">{cls.subject}</p>
                    <p className="text-sm text-gray-400">{cls.room}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-400">{cls.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;