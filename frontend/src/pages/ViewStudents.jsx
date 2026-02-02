import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { facultyAPI } from '../services/api';
import { Users, Search, Mail, Phone, Hash } from 'lucide-react';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await facultyAPI.getStudents();
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Students</h1>
            <p className="text-gray-400 mt-1">View all students in your department</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3 rounded-xl shadow-lg shadow-blue-500/50">
            <p className="text-blue-100 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-white">{students.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-4 border border-gray-800 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, user ID, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <div
              key={student._id}
              className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-xl"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/50">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{student.name}</h3>
                  <p className="text-sm text-gray-400">{student.userId}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">Roll:</span>
                  <span className="text-white font-medium">{student.rollNumber || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 truncate">{student.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">{student.phone || 'N/A'}</span>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Year {student.year}</span>
                    <span className="text-gray-400">Sem {student.semester}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-xl p-16 text-center border border-gray-800">
            <Users className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewStudents;