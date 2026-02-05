import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { facultyAPI } from '../services/api';
import { BookOpen, Users, Save, AlertCircle, CheckCircle, Activity, Award } from 'lucide-react';

const EnterMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchExistingMarks();
    }
  }, [selectedSubject]);

  const fetchData = async () => {
    try {
      const [subjectsRes, studentsRes] = await Promise.all([
        facultyAPI.getSubjects(),
        facultyAPI.getStudents(),
      ]);
      setSubjects(subjectsRes.data.data);
      setStudents(studentsRes.data.data);

      // Initialize marks with zeros
      const initialMarks = {};
      studentsRes.data.data.forEach((student) => {
        initialMarks[student._id] = { cia1: 0, cia2: 0, cia3: 0, assignment: 0 };
      });
      setMarks(initialMarks);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingMarks = async () => {
    try {
      const response = await facultyAPI.getMarksBySubject(selectedSubject);
      const existingMarks = {};

      response.data.data.forEach((mark) => {
        existingMarks[mark.student._id] = {
          cia1: mark.internalMarks.cia1,
          cia2: mark.internalMarks.cia2,
          cia3: mark.internalMarks.cia3,
          assignment: mark.internalMarks.assignment,
        };
      });

      setMarks((prev) => ({ ...prev, ...existingMarks }));
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const handleMarkChange = (studentId, field, value) => {
    const numValue = parseInt(value) || 0;
    let max = 20;
    if (field === 'assignment') max = 10;

    if (numValue < 0 || numValue > max) return;

    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: numValue },
    }));
  };

  const calculateTotal = (studentId) => {
    const studentMarks = marks[studentId];
    if (!studentMarks) return 0;
    return studentMarks.cia1 + studentMarks.cia2 + studentMarks.cia3 + studentMarks.assignment;
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
      const marksList = students.map((student) => ({
        studentId: student._id,
        cia1: marks[student._id]?.cia1 || 0,
        cia2: marks[student._id]?.cia2 || 0,
        cia3: marks[student._id]?.cia3 || 0,
        assignment: marks[student._id]?.assignment || 0,
      }));

      await facultyAPI.enterMarks({
        subjectCode: selectedSubject,
        subjectName: subject.name,
        marksList,
      });

      setMessage({ type: 'success', text: '✅ Marks saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving marks' });
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-white">Enter Marks</h1>
          <p className="text-gray-400 mt-1">Update internal assessment marks for students</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Subject Selection */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
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

        {/* Marks Table */}
        {selectedSubject && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Students ({students.length})
              </h3>
              <p className="text-sm text-gray-400 mt-1">CIA 1, 2, 3: out of 20 | Assignment: out of 10</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      CIA 1 <span className="text-xs text-gray-500">/20</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      CIA 2 <span className="text-xs text-gray-500">/20</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      CIA 3 <span className="text-xs text-gray-500">/20</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Assignment <span className="text-xs text-gray-500">/10</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Total <span className="text-xs text-gray-500">/50</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{student.name}</p>
                            <p className="text-xs text-gray-400">{student.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={marks[student._id]?.cia1 || 0}
                          onChange={(e) => handleMarkChange(student._id, 'cia1', e.target.value)}
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 text-white text-center rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={marks[student._id]?.cia2 || 0}
                          onChange={(e) => handleMarkChange(student._id, 'cia2', e.target.value)}
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 text-white text-center rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={marks[student._id]?.cia3 || 0}
                          onChange={(e) => handleMarkChange(student._id, 'cia3', e.target.value)}
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 text-white text-center rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={marks[student._id]?.assignment || 0}
                          onChange={(e) => handleMarkChange(student._id, 'assignment', e.target.value)}
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 text-white text-center rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <span className="text-xl font-bold text-purple-400">{calculateTotal(student._id)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedSubject && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EnterMarks;