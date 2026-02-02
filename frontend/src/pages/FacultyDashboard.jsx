import { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Users, Calendar, BookOpen, CheckSquare, Clock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Total Students',
      value: '9',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      shadowColor: 'shadow-blue-500/50',
    },
    {
      name: 'Classes Today',
      value: '4',
      icon: Calendar,
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      shadowColor: 'shadow-green-500/50',
    },
    {
      name: 'Subjects Assigned',
      value: '6',
      icon: BookOpen,
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-700',
      shadowColor: 'shadow-purple-500/50',
    },
    {
      name: 'Pending Tasks',
      value: '2',
      icon: CheckSquare,
      bgColor: 'bg-gradient-to-br from-orange-600 to-orange-700',
      shadowColor: 'shadow-orange-500/50',
    },
  ];

  const todayClasses = [
    { subject: 'Data Structures & Algorithms', class: 'B.Sc CS - Year 3', time: '09:00 AM', room: 'Room 301' },
    { subject: 'Web Development', class: 'B.Sc CS - Year 3', time: '11:00 AM', room: 'Lab 201' },
    { subject: 'Database Management Systems', class: 'B.Sc CS - Year 3', time: '02:00 PM', room: 'Room 302' },
  ];

  const quickActions = [
    { name: 'View Students', icon: Users, path: '/faculty/students' },
    { name: 'Mark Attendance', icon: Calendar, path: '/faculty/attendance' },
    { name: 'Enter Marks', icon: BookOpen, path: '/faculty/marks' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl shadow-purple-500/30 border border-purple-500/20">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👨‍🏫</h1>
          <p className="text-purple-100">
            Faculty Dashboard - Manage your classes and students
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
                  <div className={`${stat.bgColor} p-3 rounded-xl shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Today's Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className="w-full flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all group"
                  >
                    <div className="bg-blue-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform border border-blue-500/30">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-medium text-white">{action.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Today's Classes
            </h3>
            <div className="space-y-3">
              {todayClasses.map((cls, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div>
                    <p className="font-medium text-white">{cls.subject}</p>
                    <p className="text-sm text-gray-400">{cls.class} • {cls.room}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-400">{cls.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subjects Overview */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            My Subjects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Data Structures & Algorithms', code: 'CS301', students: 9 },
              { name: 'Web Development', code: 'CS302', students: 9 },
              { name: 'Database Management Systems', code: 'CS303', students: 9 },
              { name: 'Operating Systems', code: 'CS304', students: 9 },
              { name: 'Computer Networks', code: 'CS305', students: 9 },
              { name: 'Software Engineering', code: 'CS306', students: 9 },
            ].map((subject, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
              >
                <h4 className="font-medium text-white mb-1">{subject.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{subject.code}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{subject.students} students</span>
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