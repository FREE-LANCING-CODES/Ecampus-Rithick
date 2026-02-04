import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Target,
  CheckCircle,
  AlertCircle,
  Trophy,
  Activity,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const Marks = () => {
  const [activeTab, setActiveTab] = useState('internal');
  const [internalMarks, setInternalMarks] = useState([]);
  const [semesterResults, setSemesterResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const [internalRes, semesterRes] = await Promise.all([
        studentAPI.getInternalMarks(),
        studentAPI.getSemesterResults(),
      ]);

      setInternalMarks(internalRes.data.data);
      setSemesterResults(semesterRes.data.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall stats
  const calculateOverallCGPA = () => {
    if (semesterResults.length === 0) return '0.0';
    const validResults = semesterResults.filter(r => r.semesterMarks?.gradePoint);
    if (validResults.length === 0) return '0.0';
    
    const totalGradePoints = validResults.reduce((sum, result) => {
      return sum + (result.semesterMarks?.gradePoint || 0) * (result.credits || 0);
    }, 0);
    const totalCredits = validResults.reduce((sum, result) => sum + (result.credits || 0), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.0';
  };

  const calculateInternalAverage = () => {
    if (internalMarks.length === 0) return 0;
    const total = internalMarks.reduce((sum, mark) => sum + (mark.internalMarks?.totalInternal || 0), 0);
    return (total / internalMarks.length).toFixed(1);
  };

  const overallCGPA = calculateOverallCGPA();
  const internalAverage = calculateInternalAverage();

  // Stats cards
  const stats = [
    {
      name: 'Overall CGPA',
      value: overallCGPA,
      max: '10.0',
      icon: Trophy,
      color: 'blue',
      trend: parseFloat(overallCGPA) >= 8.5 ? 'Excellent' : parseFloat(overallCGPA) >= 7.5 ? 'Good' : 'Average',
    },
    {
      name: 'Internal Average',
      value: `${internalAverage}/50`,
      icon: Target,
      color: 'green',
      trend: internalAverage >= 40 ? 'Excellent' : internalAverage >= 35 ? 'Good' : 'Need Improvement',
    },
    {
      name: 'Subjects Passed',
      value: semesterResults.filter(r => r.semesterMarks?.result === 'Pass').length,
      total: semesterResults.length,
      icon: CheckCircle,
      color: 'green',
      trend: `${semesterResults.length} Total`,
    },
    {
      name: 'Total Credits',
      value: semesterResults.reduce((sum, r) => sum + (r.credits || 0), 0),
      icon: Award,
      color: 'purple',
      trend: 'Earned',
    },
  ];

  // Chart data for internal marks
  const internalChartData = internalMarks.map(mark => ({
    subject: mark.subjectCode,
    CIA1: mark.internalMarks?.cia1 || 0,
    CIA2: mark.internalMarks?.cia2 || 0,
    CIA3: mark.internalMarks?.cia3 || 0,
    Assignment: mark.internalMarks?.assignment || 0,
  }));

  // Radar chart data
  const radarData = internalMarks.slice(0, 6).map(mark => ({
    subject: mark.subjectCode,
    marks: mark.internalMarks?.totalInternal || 0,
    fullMark: 50,
  }));

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-600/10 to-blue-700/10',
        border: 'border-blue-500/30',
        icon: 'bg-blue-600',
        text: 'text-blue-400',
      },
      green: {
        bg: 'from-green-600/10 to-green-700/10',
        border: 'border-green-500/30',
        icon: 'bg-green-600',
        text: 'text-green-400',
      },
      purple: {
        bg: 'from-purple-600/10 to-purple-700/10',
        border: 'border-purple-500/30',
        icon: 'bg-purple-600',
        text: 'text-purple-400',
      },
      red: {
        bg: 'from-red-600/10 to-red-700/10',
        border: 'border-red-500/30',
        icon: 'bg-red-600',
        text: 'text-red-400',
      },
    };
    return colors[color] || colors.blue;
  };

  const getGradeColor = (grade) => {
    if (grade === 'O' || grade === 'A+') return 'text-green-400';
    if (grade === 'A' || grade === 'B+') return 'text-blue-400';
    if (grade === 'B' || grade === 'C') return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
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
            <h1 className="text-3xl font-bold text-white">Academic Performance</h1>
            <p className="text-gray-400 mt-1">Track your marks and grades across all subjects</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-lg">
            <p className="text-sm text-blue-400 font-medium">Semester 6</p>
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
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  {stat.max && <p className="text-lg text-gray-500">/ {stat.max}</p>}
                  {stat.total && <p className="text-lg text-gray-500">/ {stat.total}</p>}
                </div>
                <p className={`text-sm ${colors.text} font-medium mt-1`}>{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'internal'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Internal Marks
          </button>
          <button
            onClick={() => setActiveTab('semester')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'semester'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Semester Results
          </button>
        </div>

        {/* Internal Marks Tab */}
        {activeTab === 'internal' && (
          <div className="space-y-6">
            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  Internal Assessment Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={internalChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="subject" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="CIA1" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="CIA2" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="CIA3" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Assignment" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-500" />
                  Performance Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <PolarRadiusAxis stroke="#9ca3af" />
                    <Radar name="Marks Obtained" dataKey="marks" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.6} />
                    <Radar name="Total Marks" dataKey="fullMark" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Cards */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  Subject-wise Internal Marks
                </h3>
              </div>

              <div className="p-6">
                {internalMarks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No internal marks available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {internalMarks.map((mark, index) => (
                      <div
                        key={index}
                        className="p-5 bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-white text-lg">{mark.subject}</h4>
                            <p className="text-sm text-gray-400">{mark.subjectCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-400">
                              {mark.internalMarks?.totalInternal || 0}
                            </p>
                            <p className="text-xs text-gray-500">/ 50</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-center">
                            <p className="text-xs text-blue-400 mb-1">CIA 1</p>
                            <p className="text-lg font-bold text-white">{mark.internalMarks?.cia1 || 0}</p>
                            <p className="text-xs text-gray-500">/20</p>
                          </div>
                          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-center">
                            <p className="text-xs text-green-400 mb-1">CIA 2</p>
                            <p className="text-lg font-bold text-white">{mark.internalMarks?.cia2 || 0}</p>
                            <p className="text-xs text-gray-500">/20</p>
                          </div>
                          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                            <p className="text-xs text-yellow-400 mb-1">CIA 3</p>
                            <p className="text-lg font-bold text-white">{mark.internalMarks?.cia3 || 0}</p>
                            <p className="text-xs text-gray-500">/20</p>
                          </div>
                          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-3 text-center">
                            <p className="text-xs text-purple-400 mb-1">Assg</p>
                            <p className="text-lg font-bold text-white">{mark.internalMarks?.assignment || 0}</p>
                            <p className="text-xs text-gray-500">/10</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Semester Results Tab */}
        {activeTab === 'semester' && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-green-500" />
                Semester-wise Results
              </h3>
            </div>

            <div className="p-6">
              {semesterResults.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No semester results available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {semesterResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-5 bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg mb-1">{result.subject}</h4>
                          <p className="text-sm text-gray-400">{result.subjectCode} • {result.credits} Credits</p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Theory Marks</p>
                            <p className="text-2xl font-bold text-blue-400">
                              {result.semesterMarks?.theoryMarks || 0}
                            </p>
                            <p className="text-xs text-gray-500">/100</p>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Grade</p>
                            <p className={`text-3xl font-bold ${getGradeColor(result.semesterMarks?.grade)}`}>
                              {result.semesterMarks?.grade || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              GP: {result.semesterMarks?.gradePoint || 0}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Result</p>
                            <span
                              className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                                result.semesterMarks?.result === 'Pass'
                                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-600/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {result.semesterMarks?.result === 'Pass' ? (
                                <CheckCircle className="w-5 h-5 inline mr-1" />
                              ) : (
                                <AlertCircle className="w-5 h-5 inline mr-1" />
                              )}
                              {result.semesterMarks?.result || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marks;