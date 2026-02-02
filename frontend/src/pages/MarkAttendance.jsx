import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { facultyAPI } from '../services/api';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await facultyAPI.getSubjects();
      setSubjects(response.data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await facultyAPI.getStudents();
      setStudents(response.data.data);
      
      // Initialize attendance with Present for all
      const initialAttendance = {};
      response.data.data.forEach((student) => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      setMessage({ type: 'error', text: 'Please select a subject!' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const subject = subjects.find((s) => s.code === selectedSubject);
      const attendanceList = students.map((student) => ({
        studentId: student._id,
        status: attendance[student._id] || 'Present',
      }));

      await facultyAPI.markAttendance({
        subjectCode: selectedSubject,
        subjectName: subject.name,
        date: selectedDate,
        attendanceList,
      });

      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error marking attendance' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Absent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Late':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const countStatus = (status) => {
    return Object.values(attendance).filter((s) => s === status).length;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Mark Attendance</h1>
          <p className="text-gray-400 mt-1">Mark attendance for your students</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Selection */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map((subject) => (
                <option key={subject.code} value={subject.code}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 backdrop-blur-xl">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg shadow-blue-500/30">
            <p className="text-blue-100 text-sm">Total Students</p>
            <p className="text-3xl font-bold">{students.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-white shadow-lg shadow-green-500/30">
            <p className="text-green-100 text-sm">Present</p>
            <p className="text-3xl font-bold">{countStatus('Present')}</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-white shadow-lg shadow-red-500/30">
            <p className="text-red-100 text-sm">Absent</p>
            <p className="text-3xl font-bold">{countStatus('Absent')}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-4 text-white shadow-lg shadow-amber-500/30">
            <p className="text-amber-100 text-sm">Late</p>
            <p className="text-3xl font-bold">{countStatus('Late')}</p>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Students ({students.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/50">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-sm text-gray-400">
                        {student.rollNumber} • {student.userId}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student._id, 'Present')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                        attendance[student._id] === 'Present'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student._id, 'Absent')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                        attendance[student._id] === 'Absent'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student._id, 'Late')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                        attendance[student._id] === 'Late'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedSubject}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;