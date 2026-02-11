import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { adminAPI } from '../services/api';
import { 
  UserCheck, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Activity,
  X,
  Save
} from 'lucide-react';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Female',
    bloodGroup: 'B+',
    department: 'Computer Science',
    year: 1,
    semester: 1,
    designation: 'Assistant Professor',
    qualification: '',
    specialization: '',
    yearsOfExperience: 0,
    dateOfJoining: '',
    officeRoom: '',
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await adminAPI.getFaculty();
      setFaculty(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setCurrentFaculty(null);
    setFormData({
      userId: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Female',
      bloodGroup: 'B+',
      department: 'Computer Science',
      year: 1,
      semester: 1,
      designation: 'Assistant Professor',
      qualification: '',
      specialization: '',
      yearsOfExperience: 0,
      dateOfJoining: '',
      officeRoom: '',
    });
    setShowModal(true);
  };

  const handleEdit = (facultyMember) => {
    setEditMode(true);
    setCurrentFaculty(facultyMember);
    setFormData({
      userId: facultyMember.userId,
      password: '',
      name: facultyMember.name,
      email: facultyMember.email,
      phone: facultyMember.phone || '',
      dateOfBirth: facultyMember.dateOfBirth ? new Date(facultyMember.dateOfBirth).toISOString().split('T')[0] : '',
      gender: facultyMember.gender || 'Female',
      bloodGroup: facultyMember.bloodGroup || 'B+',
      department: facultyMember.department,
      year: facultyMember.year || 1,
      semester: facultyMember.semester || 1,
      designation: facultyMember.designation || 'Assistant Professor',
      qualification: facultyMember.qualification || '',
      specialization: facultyMember.specialization || '',
      yearsOfExperience: facultyMember.yearsOfExperience || 0,
      dateOfJoining: facultyMember.dateOfJoining ? new Date(facultyMember.dateOfJoining).toISOString().split('T')[0] : '',
      officeRoom: facultyMember.officeRoom || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      await adminAPI.deleteFaculty(id);
      setMessage({ type: 'success', text: '✅ Faculty deleted successfully!' });
      fetchFaculty();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting faculty' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await adminAPI.updateFaculty(currentFaculty._id, formData);
        setMessage({ type: 'success', text: '✅ Faculty updated successfully!' });
      } else {
        await adminAPI.addFaculty(formData);
        setMessage({ type: 'success', text: '✅ Faculty added successfully!' });
      }
      
      setShowModal(false);
      fetchFaculty();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving faculty' });
    }
  };

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-white">Manage Faculty</h1>
            <p className="text-gray-400 mt-1">Add, edit, or remove faculty members</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Faculty
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Faculty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Designation</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredFaculty.map((facultyMember) => (
                  <tr key={facultyMember._id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/50">
                          {facultyMember.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{facultyMember.name}</p>
                          <p className="text-sm text-gray-400">{facultyMember.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{facultyMember.userId}</td>
                    <td className="px-6 py-4 text-white">{facultyMember.department}</td>
                    <td className="px-6 py-4 text-white">{facultyMember.designation || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(facultyMember)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(facultyMember._id, facultyMember.name)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl my-8">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
                <h3 className="text-xl font-bold text-white">{editMode ? 'Edit Faculty' : 'Add New Faculty'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">User ID *</label>
                      <input
                        type="text"
                        required
                        disabled={editMode}
                        value={formData.userId}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        placeholder="e.g., dhivya476"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>

                    {!editMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., PL.Dhivya"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="e.g., dhivya476@gmail.com"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="e.g., 9944524072"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                        placeholder="e.g., Assistant Professor"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Qualification</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        placeholder="e.g., M.Sc., M.Phil."
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        placeholder="e.g., C, C++, JAVA, Python"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date of Joining</label>
                      <input
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Office Room</label>
                      <input
                        type="text"
                        value={formData.officeRoom}
                        onChange={(e) => setFormData({...formData, officeRoom: e.target.value})}
                        placeholder="e.g., Room 301"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editMode ? 'Update' : 'Add'} Faculty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageFaculty;