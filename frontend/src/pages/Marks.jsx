import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

const Marks = () => {
  const [internalMarks, setInternalMarks] = useState([]);
  const [semesterResults, setSemesterResults] = useState([]);
  const [activeTab, setActiveTab] = useState('internal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const [internal, semester] = await Promise.all([
        studentAPI.getInternalMarks(),
        studentAPI.getSemesterResults(),
      ]);
      setInternalMarks(internal.data.data || []);
      setSemesterResults(semester.data.data || []);
    } catch (error) {
      console.error('Error fetching marks:', error);
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
        <div>
          <h1 className="text-3xl font-bold text-white">Academic Results</h1>
          <p className="text-gray-400 mt-1">View your internal and semester marks</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'internal'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Internal Marks
          </button>
          <button
            onClick={() => setActiveTab('semester')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'semester'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Semester Results
          </button>
        </div>

        {/* Internal Marks */}
        {activeTab === 'internal' && (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl">
            <div className="p-6">
              {internalMarks.length > 0 ? (
                <div className="space-y-4">
                  {internalMarks.map((mark, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{mark.subject}</h3>
                          <p className="text-sm text-gray-400">{mark.subjectCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Total Internal</p>
                          <p className="text-3xl font-bold text-blue-400">
                            {mark.internalMarks.totalInternal}/50
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">CIA 1</p>
                          <p className="text-2xl font-bold text-white">{mark.internalMarks.cia1}</p>
                          <p className="text-xs text-gray-500 mt-1">out of 20</p>
                        </div>
                        <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">CIA 2</p>
                          <p className="text-2xl font-bold text-white">{mark.internalMarks.cia2}</p>
                          <p className="text-xs text-gray-500 mt-1">out of 20</p>
                        </div>
                        <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">CIA 3</p>
                          <p className="text-2xl font-bold text-white">{mark.internalMarks.cia3}</p>
                          <p className="text-xs text-gray-500 mt-1">out of 20</p>
                        </div>
                        <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">Assignment</p>
                          <p className="text-2xl font-bold text-white">{mark.internalMarks.assignment}</p>
                          <p className="text-xs text-gray-500 mt-1">out of 10</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No internal marks available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Semester Results */}
        {activeTab === 'semester' && (
          <div className="space-y-6">
            {semesterResults.length > 0 ? (
              semesterResults.map((sem, index) => (
                <div key={index} className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-green-600/20 to-green-700/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Semester {sem.semester}</h3>
                        <p className="text-sm text-gray-400 mt-1">{sem.academicYear}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">GPA</p>
                        <p className="text-4xl font-bold text-green-400">{sem.gpa}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3">
                      {sem.subjects.map((subject, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all">
                          <div>
                            <p className="font-medium text-white">{subject.subject}</p>
                            <p className="text-sm text-gray-400">{subject.subjectCode}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Grade</p>
                              <p className="text-2xl font-bold text-blue-400">{subject.grade}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Credits</p>
                              <p className="text-xl font-semibold text-white">{subject.credits}</p>
                            </div>
                            <div>
                              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                subject.result === 'Pass' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {subject.result}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-16 text-center">
                <Award className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No semester results available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marks;