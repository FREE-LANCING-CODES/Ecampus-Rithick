import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { facultyAPI } from '../services/api';
import { Calendar, Users, CheckCircle, XCircle, Clock, Activity, Save } from 'lucide-react';

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, studentsRes] = await Promise.all([
        facultyAPI.getSubjects(),
        facultyAPI.getStudents(),
      ]);
      setSubjects(subjectsRes.data.data);
      setStudents(studentsRes.data.data);
      
      // Initialize all as Present
      const initialAttendance = {};
      studentsRes.data.data.forEach((student) => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
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

      setMessage({ type: 'success', text: '✅ Attendance marked successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error marking attendance' });
    } finally {
      setSaving(false);
    }
  };

  const countStatus = (status) => Object.values(attendance).filter((s) => s === status).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Mark Attendance</h1>
          <p className="text-gray-400 mt-1">Record student attendance for today's class</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Subject & Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map((subject) => (
                <option key={subject.code} value={subject.code}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 rounded-xl p-4 border border-blue-500/30">
            <p className="text-blue-100 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-white">{students.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 rounded-xl p-4 border border-green-500/30">
            <p className="text-green-100 text-sm">Present</p>
            <p className="text-3xl font-bold text-white">{countStatus('Present')}</p>
          </div>
          <div className="bg-gradient-to-br from-red-600/10 to-red-700/10 rounded-xl p-4 border border-red-500/30">
            <p className="text-red-100 text-sm">Absent</p>
            <p className="text-3xl font-bold text-white">{countStatus('Absent')}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-700/10 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-yellow-100 text-sm">Late</p>
            <p className="text-3xl font-bold text-white">{countStatus('Late')}</p>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Students ({students.length})
            </h3>
          </div>

          <div className="p-6 space-y-3">
            {students.map((student) => (
              <div key={student._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{student.name}</p>
                    <p className="text-sm text-gray-400">{student.rollNumber} • {student.userId}</p>
                  </div>
                </div>

                {/* ✅ FIXED: Better button alignment & responsive */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAttendanceChange(student._id, 'Present')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      attendance[student._id] === 'Present'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student._id, 'Absent')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      attendance[student._id] === 'Absent'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student._id, 'Late')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      attendance[student._id] === 'Late'
                        ? 'bg-yellow-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedSubject}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;