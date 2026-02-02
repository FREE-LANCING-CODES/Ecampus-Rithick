import { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import { User, Mail, Phone, Calendar, Droplet, GraduationCap, Hash, MapPin, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();

  const personalInfo = [
    { label: 'Full Name', value: user?.name, icon: User },
    { label: 'User ID', value: user?.userId, icon: Hash },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Phone', value: user?.phone || 'Not provided', icon: Phone },
    { label: 'Roll Number', value: user?.rollNumber || 'Not assigned', icon: GraduationCap },
  ];

  const academicInfo = [
    { label: 'Department', value: user?.department },
    { label: 'Year', value: `Year ${user?.year}` },
    { label: 'Semester', value: `Semester ${user?.semester}` },
    { label: 'Section', value: 'C' },
  ];

  const additionalInfo = [
    { label: 'Gender', value: user?.gender || 'Not provided' },
    { label: 'Blood Group', value: user?.bloodGroup || 'Not provided', icon: Droplet },
    { label: 'Date of Birth', value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-400 mt-1">View and manage your personal information</p>
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button> */}
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold shadow-2xl">
                {user?.name?.charAt(0)}
              </div>
              {/* Basic Info */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
                <p className="text-blue-100 text-lg">{user?.userId}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium backdrop-blur-xl">
                    {user?.role?.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    user?.isActive 
                      ? 'bg-green-500/30 text-green-100 border border-green-400/30' 
                      : 'bg-red-500/30 text-red-100 border border-red-400/30'
                  }`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-400">{info.label}</p>
                    </div>
                    <p className="text-white font-medium ml-11">{info.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Information */}
          <div className="p-6 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-500" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {academicInfo.map((info, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center hover:border-gray-600 transition-all">
                  <p className="text-sm text-gray-400 mb-2">{info.label}</p>
                  <p className="text-white font-semibold text-lg">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {additionalInfo.map((info, index) => {
                const Icon = info.icon || User;
                return (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      {info.icon && (
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <p className="text-sm text-gray-400">{info.label}</p>
                    </div>
                    <p className="text-white font-medium ml-11">{info.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Account Created</p>
              <p className="text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Last Updated</p>
              <p className="text-white font-medium">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;