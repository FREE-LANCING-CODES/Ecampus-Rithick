import { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Droplet, 
  GraduationCap, 
  Hash, 
  MapPin, 
  Edit,
  Shield,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Download,
  Share2,
  Activity,
  TrendingUp,
  Target
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, academic

  const personalInfo = [
    { label: 'Full Name', value: user?.name, icon: User, color: 'blue' },
    { label: 'User ID', value: user?.userId, icon: Hash, color: 'purple' },
    { label: 'Email', value: user?.email, icon: Mail, color: 'green' },
    { label: 'Phone', value: user?.phone || 'Not provided', icon: Phone, color: 'yellow' },
    { label: 'Roll Number', value: user?.rollNumber || 'Not assigned', icon: GraduationCap, color: 'red' },
    { label: 'Gender', value: user?.gender || 'Not provided', icon: User, color: 'pink' },
  ];

  const academicInfo = [
    { label: 'Department', value: user?.department, icon: BookOpen },
    { label: 'Year', value: `Year ${user?.year}`, icon: Calendar },
    { label: 'Semester', value: `Semester ${user?.semester}`, icon: GraduationCap },
    { label: 'Section', value: 'C', icon: User },
  ];

  const additionalInfo = [
    { label: 'Blood Group', value: user?.bloodGroup || 'Not provided', icon: Droplet, color: 'red' },
    { label: 'Date of Birth', value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided', icon: Calendar, color: 'blue' },
  ];

  // Quick stats for profile
  const quickStats = [
    { label: 'Attendance', value: '87.5%', icon: CheckCircle2, color: 'green', trend: '+2.5%' },
    { label: 'CGPA', value: '8.7', icon: Award, color: 'blue', trend: '+0.3' },
    { label: 'Credits', value: '145', icon: BookOpen, color: 'purple', trend: '+18' },
    { label: 'Rank', value: '#12', icon: Target, color: 'yellow', trend: '+3' },
  ];

  // Activity timeline
  const recentActivity = [
    { action: 'Attendance marked', subject: 'Data Structures', time: '2 hours ago', icon: CheckCircle2, color: 'green' },
    { action: 'Assignment submitted', subject: 'Web Development', time: '5 hours ago', icon: BookOpen, color: 'blue' },
    { action: 'Profile updated', subject: 'Personal Information', time: '2 days ago', icon: Edit, color: 'purple' },
    { action: 'Fee paid', subject: 'Semester 5', time: '1 week ago', icon: CheckCircle2, color: 'green' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Tabs */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <User className="w-10 h-10" />
                  My Profile
                </h1>
                <p className="text-blue-100 text-lg">
                  View and manage your personal information
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl transition-all border border-white/20 hover:scale-105">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Navigation Tabs - ONLY 2 TABS NOW */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-xl border border-white/20 max-w-md">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('academic')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'academic'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Academic
              </button>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Profile Header Card */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden shadow-xl">
              {/* Enhanced Header with Avatar */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Avatar with Status */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white to-blue-50 flex items-center justify-center text-blue-600 text-5xl font-bold shadow-2xl border-4 border-white/20">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-full border-4 border-blue-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 text-white">
                    <h2 className="text-4xl font-bold mb-2">{user?.name}</h2>
                    <p className="text-blue-100 text-lg mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      {user?.userId}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold backdrop-blur-xl border border-white/30 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {user?.role?.toUpperCase()}
                      </span>
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                        user?.isActive 
                          ? 'bg-green-500/30 text-green-100 border border-green-400/30' 
                          : 'bg-red-500/30 text-red-100 border border-red-400/30'
                      }`}>
                        <Activity className="w-4 h-4" />
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-4 py-2 bg-purple-500/30 text-purple-100 border border-purple-400/30 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Semester {user?.semester}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 transition-all hover:scale-110">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-800/30">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colorMap = {
                    green: { bg: 'bg-green-500/20', text: 'text-green-400' },
                    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
                    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
                    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
                  };
                  const colors = colorMap[stat.color];
                  
                  return (
                    <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group hover:scale-105">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className="text-xs text-green-400 font-semibold">{stat.trend}</span>
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Info */}
              <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalInfo.map((info, index) => {
                    const Icon = info.icon;
                    const colorMap = {
                      blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400', hover: 'hover:border-blue-500/40' },
                      purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/20', iconText: 'text-purple-400', hover: 'hover:border-purple-500/40' },
                      green: { bg: 'bg-green-500/5', border: 'border-green-500/20', iconBg: 'bg-green-500/20', iconText: 'text-green-400', hover: 'hover:border-green-500/40' },
                      yellow: { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', iconBg: 'bg-yellow-500/20', iconText: 'text-yellow-400', hover: 'hover:border-yellow-500/40' },
                      red: { bg: 'bg-red-500/5', border: 'border-red-500/20', iconBg: 'bg-red-500/20', iconText: 'text-red-400', hover: 'hover:border-red-500/40' },
                      pink: { bg: 'bg-pink-500/5', border: 'border-pink-500/20', iconBg: 'bg-pink-500/20', iconText: 'text-pink-400', hover: 'hover:border-pink-500/40' },
                    };
                    const colors = colorMap[info.color];
                    
                    return (
                      <div key={index} className={`${colors.bg} rounded-xl p-5 border ${colors.border} ${colors.hover} transition-all group`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`${colors.iconBg} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 ${colors.iconText}`} />
                          </div>
                          <p className="text-sm font-medium text-gray-400">{info.label}</p>
                        </div>
                        <p className="text-white font-semibold text-lg ml-12">{info.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Additional Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalInfo.map((info, index) => {
                      const Icon = info.icon;
                      const colorMap = {
                        red: { bg: 'bg-red-500/5', border: 'border-red-500/20', iconBg: 'bg-red-500/20', iconText: 'text-red-400', hover: 'hover:border-red-500/40' },
                        blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400', hover: 'hover:border-blue-500/40' },
                      };
                      const colors = colorMap[info.color];
                      
                      return (
                        <div key={index} className={`${colors.bg} rounded-xl p-5 border ${colors.border} ${colors.hover} transition-all`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`${colors.iconBg} p-2.5 rounded-lg`}>
                              <Icon className={`w-5 h-5 ${colors.iconText}`} />
                            </div>
                            <p className="text-sm font-medium text-gray-400">{info.label}</p>
                          </div>
                          <p className="text-white font-semibold text-lg ml-12">{info.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    const colorMap = {
                      green: { bg: 'bg-green-500/20', text: 'text-green-400' },
                      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
                      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
                    };
                    const colors = colorMap[activity.color];
                    
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group">
                        <div className="flex items-start gap-3">
                          <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm">{activity.action}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.subject}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-yellow-500" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-500/20 p-2.5 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Account Created</p>
                  </div>
                  <p className="text-white font-semibold text-lg ml-12">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500/20 p-2.5 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Last Updated</p>
                  </div>
                  <p className="text-white font-semibold text-lg ml-12">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            {/* Academic Information */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-green-500" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {academicInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all text-center group hover:scale-105">
                      <div className="inline-flex bg-blue-500/20 p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-400 mb-2 font-medium">{info.label}</p>
                      <p className="text-white font-bold text-xl">{info.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 rounded-xl p-6 border border-green-500/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">8.7</p>
                <p className="text-sm text-gray-400">Current CGPA</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 rounded-xl p-6 border border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">145</p>
                <p className="text-sm text-gray-400">Total Credits</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 rounded-xl p-6 border border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">#12</p>
                <p className="text-sm text-gray-400">Class Rank</p>
              </div>
            </div>

            {/* Academic Timeline */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-500" />
                Academic Timeline
              </h3>
              <div className="space-y-4">
                {[
                  { sem: 'Semester 5', status: 'Current', color: 'green' },
                  { sem: 'Semester 4', status: 'Completed - SGPA: 8.8', color: 'blue' },
                  { sem: 'Semester 3', status: 'Completed - SGPA: 8.6', color: 'blue' },
                  { sem: 'Semester 2', status: 'Completed - SGPA: 8.4', color: 'blue' },
                  { sem: 'Semester 1', status: 'Completed - SGPA: 8.2', color: 'blue' },
                ].map((item, index) => {
                  const colorMap = {
                    green: { bg: 'bg-green-500/5', border: 'border-green-500/20', iconBg: 'bg-green-500/20', iconText: 'text-green-400' },
                    blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400' },
                  };
                  const colors = colorMap[item.color];
                  
                  return (
                    <div key={index} className={`${colors.bg} border ${colors.border} rounded-xl p-4 flex items-center gap-4`}>
                      <div className={`${colors.iconBg} p-3 rounded-lg`}>
                        <GraduationCap className={`w-5 h-5 ${colors.iconText}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.sem}</p>
                        <p className="text-sm text-gray-400">{item.status}</p>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${colors.iconText}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;