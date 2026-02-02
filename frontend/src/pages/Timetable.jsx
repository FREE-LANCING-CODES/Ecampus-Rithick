import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await studentAPI.getTimetable();
      setTimetable(response.data.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodColor = (type) => {
    switch (type) {
      case 'Theory':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'Lab':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'Tutorial':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'Break':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
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
          <h1 className="text-3xl font-bold text-white">Timetable</h1>
          <p className="text-gray-400 mt-1">Your weekly class schedule</p>
        </div>

        {timetable ? (
          <>
            {/* Timetable Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Department</p>
                  <p className="font-semibold text-xl">{timetable.department}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Year & Semester</p>
                  <p className="font-semibold text-xl">
                    Year {timetable.year} - Sem {timetable.semester}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Section</p>
                  <p className="font-semibold text-xl">{timetable.section}</p>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-5">
              {timetable.schedule?.map((day, index) => (
                <div key={index} className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden">
                  <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-800">
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      {day.day}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {day.periods?.map((period, idx) => (
                        <div
                          key={idx}
                          className={`border-2 rounded-xl p-5 ${getPeriodColor(period.type)} backdrop-blur-xl hover:scale-105 transition-transform`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold px-3 py-1 bg-black/30 rounded-lg">
                              Period {period.periodNumber}
                            </span>
                            <span className={`text-xs font-medium px-3 py-1 rounded-lg ${
                              period.type === 'Break' 
                                ? 'bg-yellow-500/30' 
                                : 'bg-black/30'
                            }`}>
                              {period.type}
                            </span>
                          </div>

                          <h4 className="font-bold text-lg mb-1">{period.subject}</h4>
                          <p className="text-sm opacity-75 mb-4">{period.subjectCode}</p>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>
                                {period.startTime} - {period.endTime}
                              </span>
                            </div>

                            {period.facultyName && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span>{period.facultyName}</span>
                              </div>
                            )}

                            {period.roomNumber && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{period.roomNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-xl">
              <h3 className="font-semibold text-white mb-4">Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-400">Theory</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-400">Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-400">Tutorial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-400">Break</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-16 text-center">
            <Clock className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No timetable available</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Timetable;