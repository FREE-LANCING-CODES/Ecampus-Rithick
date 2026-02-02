import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { Calendar, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Attendance</h1>
            <p className="text-gray-400 mt-1">Track your attendance records</p>
          </div>
        </div>

        {/* Overall Attendance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/20">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-xl">
              <Calendar className="w-10 h-10" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Overall Attendance</p>
              <p className="text-5xl font-bold mb-2">
                {attendance?.overall?.percentage || 0}%
              </p>
              <p className="text-blue-100 text-sm">
                {attendance?.overall?.attended || 0} / {attendance?.overall?.totalClasses || 0} classes attended
              </p>
            </div>
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Subject-wise Attendance
            </h2>
          </div>
          <div className="p-6">
            {attendance?.subjectWise?.length > 0 ? (
              <div className="space-y-4">
                {attendance.subjectWise.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{subject.subjectName}</h3>
                        <p className="text-sm text-gray-400">{subject.subjectCode}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${
                          subject.percentage >= 75 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {subject.percentage}%
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {subject.attended} / {subject.totalClasses}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          subject.percentage >= 75 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                    
                    {subject.percentage < 75 && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-4 h-4" />
                        <span>Attendance below 75% - Action required!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No attendance records found</p>
                <p className="text-gray-600 text-sm mt-2">Your attendance will appear here once marked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;