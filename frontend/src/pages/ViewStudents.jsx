import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { facultyAPI } from '../services/api';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Hash, 
  Calendar,
  Award,
  Activity,
  Filter,
  Download,
  Eye,
  TrendingUp,
  BookOpen
} from 'lucide-react';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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

  // Filter and sort students
  const filteredStudents = students
    .filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGender = filterGender === 'all' || student.gender === filterGender;
      
      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rollNumber') return (a.rollNumber || '').localeCompare(b.rollNumber || '');
      if (sortBy === 'userId') return a.userId.localeCompare(b.userId);
      return 0;
    });

  // Stats
  const stats = [
    {
      name: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'blue',
      trend: 'Active'
    },
    {
      name: 'Male Students',
      value: students.filter(s => s.gender === 'Male').length,
      icon: Users,
      color: 'purple',
      trend: `${((students.filter(s => s.gender === 'Male').length / students.length) * 100).toFixed(0)}%`
    },
    {
      name: 'Female Students',
      value: students.filter(s => s.gender === 'Female').length,
      icon: Users,
      color: 'pink',
      trend: `${((students.filter(s => s.gender === 'Female').length / students.length) * 100).toFixed(0)}%`
    },
    {
      name: 'Year 3 Students',
      value: students.filter(s => s.year === 3).length,
      icon: Award,
      color: 'green',
      trend: 'Current Year'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-600/10 to-blue-700/10',
        border: 'border-blue-500/30',
        icon: 'bg-blue-600',
        text: 'text-blue-400',
      },
      purple: {
        bg: 'from-purple-600/10 to-purple-700/10',
        border: 'border-purple-500/30',
        icon: 'bg-purple-600',
        text: 'text-purple-400',
      },
      pink: {
        bg: 'from-pink-600/10 to-pink-700/10',
        border: 'border-pink-500/30',
        icon: 'bg-pink-600',
        text: 'text-pink-400',
      },
      green: {
        bg: 'from-green-600/10 to-green-700/10',
        border: 'border-green-500/30',
        icon: 'bg-green-600',
        text: 'text-green-400',
      },
    };
    return colors[color] || colors.blue;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Students Directory</h1>
            <p className="text-gray-400 mt-1">View and manage all students in your department</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-purple-500/30">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-xl p-6 border ${colors.border} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${colors.icon} p-3 rounded-lg shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-sm ${colors.text} font-medium`}>{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Students</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, user ID, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter by Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Gender</label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'name'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('rollNumber')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'rollNumber'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Roll Number
            </button>
            <button
              onClick={() => setSortBy('userId')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'userId'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              User ID
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing <span className="font-semibold text-white">{filteredStudents.length}</span> of{' '}
            <span className="font-semibold text-white">{students.length}</span> students
          </p>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No students found</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-xl hover:shadow-xl hover:scale-105 group"
              >
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate">{student.name}</h3>
                    <p className="text-sm text-gray-400">{student.userId}</p>
                  </div>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Student Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm p-2 bg-gray-800/50 rounded-lg">
                    <Hash className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">Roll:</span>
                    <span className="text-white font-medium ml-auto">{student.rollNumber || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm p-2 bg-gray-800/50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400 truncate flex-1">{student.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm p-2 bg-gray-800/50 rounded-lg">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">{student.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm p-2 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">Year {student.year}, Sem {student.semester}</span>
                  </div>
                </div>

                {/* Blood Group & Gender */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg">
                      <span className="text-sm font-semibold text-red-400">{student.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                      <span className="text-sm font-semibold text-blue-400">{student.gender || 'N/A'}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg ${student.isActive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    <span className="text-xs font-semibold">{student.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewStudents;