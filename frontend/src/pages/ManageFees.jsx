import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { adminAPI } from '../services/api';
import {
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Activity,
  CreditCard
} from 'lucide-react';

const ManageFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]); // ← NEW: For dropdown
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [message, setMessage] = useState(null);

  // Form data - WITH DEFAULT DUE DATE ✅
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    semester: 6,
    academicYear: '2025-2026',
    tuitionFee: 25000,
    examFee: 2000,
    libraryFee: 1500,
    labFee: 3000,
    sportsFee: 1000,
    otherFees: 500,
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] // ← FIXED: 30 days from today
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMode: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: ''
  });

  useEffect(() => {
    fetchData();
    fetchStudents(); // ← NEW: Load students
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching fee data...');
      
      const [feesRes, statsRes] = await Promise.all([
        adminAPI.getAllFees(),
        adminAPI.getFeeStatistics()
      ]);
      
      console.log('✅ Data received');
      
      setFees(feesRes.data.data || []);
      setStatistics(statsRes.data.data || {
        totalCollected: 0,
        totalPending: 0,
        totalOverdue: 0,
        byStatus: { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 }
      });
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ type: 'error', text: 'Error loading data' });
      setFees([]);
      setStatistics({
        totalCollected: 0,
        totalPending: 0,
        totalOverdue: 0,
        byStatus: { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  // ← NEW: Fetch students for dropdown
  const fetchStudents = async () => {
    try {
      const res = await adminAPI.getStudents();
      setStudents(res.data.data || []);
      console.log('✅ Students loaded:', res.data.data.length);
    } catch (error) {
      console.error('❌ Error loading students:', error);
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    
    if (!feeForm.studentId) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return;
    }

    try {
      const feeStructure = {
        tuitionFee: parseFloat(feeForm.tuitionFee),
        examFee: parseFloat(feeForm.examFee),
        libraryFee: parseFloat(feeForm.libraryFee),
        labFee: parseFloat(feeForm.labFee),
        sportsFee: parseFloat(feeForm.sportsFee),
        otherFees: parseFloat(feeForm.otherFees),
        totalFee: 0
      };

      console.log('Creating fee with studentId:', feeForm.studentId);

      await adminAPI.createOrUpdateFee({
        studentId: feeForm.studentId,
        semester: feeForm.semester,
        academicYear: feeForm.academicYear,
        feeStructure,
        dueDate: feeForm.dueDate
      });

      setMessage({ type: 'success', text: 'Fee created successfully!' });
      setShowModal(false);
      fetchData();
      
      // Reset form
      setFeeForm({
        studentId: '',
        semester: 6,
        academicYear: '2025-2026',
        tuitionFee: 25000,
        examFee: 2000,
        libraryFee: 1500,
        labFee: 3000,
        sportsFee: 1000,
        otherFees: 500,
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating fee' });
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    try {
      await adminAPI.addPayment({
        feeId: selectedFee._id,
        amount: parseFloat(paymentForm.amount),
        paymentMode: paymentForm.paymentMode,
        paymentDate: paymentForm.paymentDate,
        transactionId: paymentForm.transactionId
      });

      setMessage({ type: 'success', text: 'Payment added successfully!' });
      setShowPaymentModal(false);
      fetchData();
      
      // Reset payment form
      setPaymentForm({
        amount: '',
        paymentMode: 'Cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error adding payment' });
    }
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
            <h1 className="text-3xl font-bold text-white">Fee Management</h1>
            <p className="text-gray-400 mt-1">Manage student fees and payments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Fee
          </button>
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
            <button onClick={() => setMessage(null)} className="ml-auto text-white hover:opacity-70">✕</button>
          </div>
        )}

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 rounded-xl p-6 border border-green-500/30">
              <div className="bg-green-500/20 p-3 rounded-xl w-fit mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">₹{(statistics.totalCollected / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-400 mt-1">Total Collected</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-700/10 rounded-xl p-6 border border-yellow-500/30">
              <div className="bg-yellow-500/20 p-3 rounded-xl w-fit mb-4">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">₹{(statistics.totalPending / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-400 mt-1">Total Pending</p>
            </div>

            <div className="bg-gradient-to-br from-red-600/10 to-red-700/10 rounded-xl p-6 border border-red-500/30">
              <div className="bg-red-500/20 p-3 rounded-xl w-fit mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white">₹{(statistics.totalOverdue / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-400 mt-1">Overdue</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 rounded-xl p-6 border border-blue-500/30">
              <div className="bg-blue-500/20 p-3 rounded-xl w-fit mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{statistics.byStatus.Paid || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Fully Paid</p>
            </div>
          </div>
        )}

        {/* Fee Table */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Student Fees ({fees.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            {fees.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Semester</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total Fee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Paid</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Pending</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {fees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{fee.student?.name}</p>
                          <p className="text-sm text-gray-400">{fee.student?.rollNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">Sem {fee.semester}</td>
                      <td className="px-6 py-4 text-white font-semibold">₹{fee.feeStructure.totalFee.toLocaleString()}</td>
                      <td className="px-6 py-4 text-green-400 font-semibold">₹{fee.paymentDetails.amountPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-red-400 font-semibold">₹{fee.paymentDetails.amountPending.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                          fee.paymentDetails.paymentStatus === 'Paid' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : fee.paymentDetails.paymentStatus === 'Partial' 
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {fee.paymentDetails.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedFee(fee);
                            setShowPaymentModal(true);
                          }}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                          title="Add Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No fee records found</p>
                <p className="text-gray-600 text-sm mt-2">Click "Add Fee" to create your first fee record</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Fee Modal - WITH DROPDOWN ✅ */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Add Fee Structure</h2>
                <p className="text-sm text-gray-400 mt-1">Select student and configure fee details</p>
              </div>
              
              <form onSubmit={handleCreateFee} className="p-6 space-y-4">
                {/* STUDENT DROPDOWN ✅ */}
                <div className="col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Select Student *
                    <span className="text-xs text-gray-400 ml-2">({students.length} students)</span>
                  </label>
                  <select
                    value={feeForm.studentId}
                    onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber} ({student.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Semester</label>
                    <select
                      value={feeForm.semester}
                      onChange={(e) => setFeeForm({ ...feeForm, semester: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    >
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Academic Year</label>
                    <input
                      type="text"
                      value={feeForm.academicYear}
                      onChange={(e) => setFeeForm({ ...feeForm, academicYear: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Tuition Fee</label>
                    <input
                      type="number"
                      value={feeForm.tuitionFee}
                      onChange={(e) => setFeeForm({ ...feeForm, tuitionFee: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Exam Fee</label>
                    <input
                      type="number"
                      value={feeForm.examFee}
                      onChange={(e) => setFeeForm({ ...feeForm, examFee: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Library Fee</label>
                    <input
                      type="number"
                      value={feeForm.libraryFee}
                      onChange={(e) => setFeeForm({ ...feeForm, libraryFee: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Lab Fee</label>
                    <input
                      type="number"
                      value={feeForm.labFee}
                      onChange={(e) => setFeeForm({ ...feeForm, labFee: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Sports Fee</label>
                    <input
                      type="number"
                      value={feeForm.sportsFee}
                      onChange={(e) => setFeeForm({ ...feeForm, sportsFee: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Other Fees</label>
                    <input
                      type="number"
                      value={feeForm.otherFees}
                      onChange={(e) => setFeeForm({ ...feeForm, otherFees: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    />
                  </div>
                </div>

                {/* DUE DATE FIELD ✅ */}
                <div>
                  <label className="block text-white font-medium mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={feeForm.dueDate}
                    onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Save Fee Structure
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Payment Modal ✅ */}
        {showPaymentModal && selectedFee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Add Payment</h2>
                <p className="text-gray-400 mt-1">{selectedFee.student?.name} - {selectedFee.student?.rollNumber}</p>
                <p className="text-sm text-red-400 mt-1">Pending: ₹{selectedFee.paymentDetails.amountPending.toLocaleString()}</p>
              </div>
              
              <form onSubmit={handleAddPayment} className="p-6 space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Amount *</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount"
                    max={selectedFee.paymentDetails.amountPending}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Max: ₹{selectedFee.paymentDetails.amountPending.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Payment Mode</label>
                  <select
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                  >
                    <option>Cash</option>
                    <option>Online</option>
                    <option>Cheque</option>
                    <option>DD</option>
                    <option>Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Payment Date</label>
                  <input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Transaction ID (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    placeholder="TXN12345"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Add Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                  >
                    Cancel
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

export default ManageFees;