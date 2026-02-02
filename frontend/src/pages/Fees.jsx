import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import { DollarSign, CreditCard, Receipt, TrendingUp, AlertCircle } from 'lucide-react';

const Fees = () => {
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await studentAPI.getFees();
      setFeeDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
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
          <h1 className="text-3xl font-bold text-white">Fee Details</h1>
          <p className="text-gray-400 mt-1">View your fee structure and payment history</p>
        </div>

        {feeDetails?.overall ? (
          <>
            {/* Overall Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-blue-100 font-medium">Total Fee</p>
                </div>
                <p className="text-4xl font-bold">₹{feeDetails.overall.totalFeeAmount.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-2xl shadow-green-500/30 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <p className="text-green-100 font-medium">Amount Paid</p>
                </div>
                <p className="text-4xl font-bold">₹{feeDetails.overall.totalPaid.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-2">
                  {feeDetails.overall.percentagePaid}% paid
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-2xl shadow-red-500/30 border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="text-red-100 font-medium">Pending Amount</p>
                </div>
                <p className="text-4xl font-bold">₹{feeDetails.overall.totalPending.toLocaleString()}</p>
              </div>
            </div>

            {/* Semester-wise Fee Details */}
            <div className="space-y-6">
              {feeDetails.semesterWise?.map((fee, index) => (
                <div key={index} className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Semester {fee.semester}</h3>
                        <p className="text-sm text-gray-400 mt-1">{fee.academicYear}</p>
                      </div>
                      <span className={`px-5 py-2 rounded-xl text-sm font-medium shadow-lg ${
                        fee.paymentDetails.paymentStatus === 'Paid'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : fee.paymentDetails.paymentStatus === 'Partial'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {fee.paymentDetails.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      {/* Fee Breakdown */}
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-blue-500" />
                          Fee Breakdown
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Tuition Fee</span>
                            <span className="font-medium text-white">₹{fee.feeStructure.tuitionFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Exam Fee</span>
                            <span className="font-medium text-white">₹{fee.feeStructure.examFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Library Fee</span>
                            <span className="font-medium text-white">₹{fee.feeStructure.libraryFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Lab Fee</span>
                            <span className="font-medium text-white">₹{fee.feeStructure.labFee.toLocaleString()}</span>
                          </div>
                          {fee.feeStructure.otherFees > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Other Fees</span>
                              <span className="font-medium text-white">₹{fee.feeStructure.otherFees.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between font-semibold">
                            <span className="text-white">Total Fee</span>
                            <span className="text-blue-400 text-lg">₹{fee.feeStructure.totalFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          Payment Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Fee</span>
                            <span className="font-medium text-white">₹{fee.feeStructure.totalFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount Paid</span>
                            <span className="font-medium text-green-400">₹{fee.paymentDetails.amountPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount Pending</span>
                            <span className="font-medium text-red-400">₹{fee.paymentDetails.amountPending.toLocaleString()}</span>
                          </div>
                          {fee.paymentDetails.lastPaymentDate && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Last Payment</span>
                              <span className="font-medium text-white">
                                {new Date(fee.paymentDetails.lastPaymentDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Due Date</span>
                            <span className="font-medium text-white">
                              {new Date(fee.paymentDetails.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400 font-medium">Payment Progress</span>
                        <span className="font-semibold text-white">
                          {((fee.paymentDetails.amountPaid / fee.feeStructure.totalFee) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 shadow-lg shadow-green-500/50"
                          style={{ width: `${(fee.paymentDetails.amountPaid / fee.feeStructure.totalFee) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Transactions */}
                    {fee.transactions?.length > 0 && (
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-500" />
                          Payment History
                        </h4>
                        <div className="space-y-3">
                          {fee.transactions.map((txn, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
                              <div>
                                <p className="font-medium text-white">{txn.transactionId}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(txn.paymentDate).toLocaleDateString()} • {txn.paymentMode}
                                </p>
                              </div>
                              <span className="font-semibold text-green-400 text-lg">₹{txn.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-16 text-center">
            <DollarSign className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No fee details available</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Fees;