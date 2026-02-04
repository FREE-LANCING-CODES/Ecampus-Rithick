import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { studentAPI } from '../services/api';
import {
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Receipt,
  Download,
  Activity,
  Wallet,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Fees = () => {
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      const response = await studentAPI.getFees();
      setFeeDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching fee details:', error);
    } finally {
      setLoading(false);
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

  if (!feeDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No fee details available</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalFee = feeDetails.feeStructure?.totalFee || 0;
  const amountPaid = feeDetails.paymentDetails?.amountPaid || 0;
  const amountPending = feeDetails.paymentDetails?.amountPending || 0;
  const paymentStatus = feeDetails.paymentDetails?.paymentStatus || 'Pending';
  const percentagePaid = totalFee > 0 ? ((amountPaid / totalFee) * 100).toFixed(1) : 0;

  // Stats cards
  const stats = [
    {
      name: 'Total Fee',
      value: `₹${totalFee.toLocaleString()}`,
      icon: Wallet,
      color: 'blue',
      trend: 'Academic Year 2025-26',
    },
    {
      name: 'Amount Paid',
      value: `₹${amountPaid.toLocaleString()}`,
      icon: CheckCircle,
      color: 'green',
      trend: `${percentagePaid}% Completed`,
    },
    {
      name: 'Pending Amount',
      value: `₹${amountPending.toLocaleString()}`,
      icon: AlertCircle,
      color: amountPending > 0 ? 'red' : 'green',
      trend: amountPending > 0 ? 'Payment Due' : 'Fully Paid',
    },
    {
      name: 'Payment Status',
      value: paymentStatus,
      icon: Activity,
      color: paymentStatus === 'Paid' ? 'green' : paymentStatus === 'Partial' ? 'yellow' : 'red',
      trend: feeDetails.transactions?.length || 0 + ' Transactions',
    },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Paid', value: amountPaid, color: '#10b981' },
    { name: 'Pending', value: amountPending, color: '#dc3545' },
  ];

  // Fee structure chart data
  const feeStructureData = feeDetails.feeStructure ? [
    { name: 'Tuition', amount: feeDetails.feeStructure.tuitionFee },
    { name: 'Exam', amount: feeDetails.feeStructure.examFee },
    { name: 'Library', amount: feeDetails.feeStructure.libraryFee },
    { name: 'Lab', amount: feeDetails.feeStructure.labFee },
    { name: 'Sports', amount: feeDetails.feeStructure.sportsFee },
    { name: 'Bus', amount: feeDetails.feeStructure.busFee },
    { name: 'Other', amount: feeDetails.feeStructure.otherFees },
  ].filter(item => item.amount > 0) : [];

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
      yellow: {
        bg: 'from-yellow-600/10 to-yellow-700/10',
        border: 'border-yellow-500/30',
        icon: 'bg-yellow-600',
        text: 'text-yellow-400',
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

  const getPaymentStatusColor = (status) => {
    if (status === 'Paid') return 'green';
    if (status === 'Partial') return 'yellow';
    if (status === 'Pending') return 'red';
    return 'gray';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Fee Details</h1>
            <p className="text-gray-400 mt-1">Manage your fee payments and view transaction history</p>
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
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-sm ${colors.text} font-medium`}>{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Payment Progress & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Progress */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Payment Progress
              </h3>

              {/* Circular Progress */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold text-white">{percentagePaid}%</p>
                    <p className="text-sm text-gray-400">Paid</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Payment Completion</span>
                  <span className="text-sm font-semibold text-white">{percentagePaid}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${percentagePaid}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Amount Paid</span>
                  </div>
                  <span className="text-sm font-semibold text-white">₹{amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-600/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-white">₹{amountPending.toLocaleString()}</span>
                </div>
              </div>

              {/* Due Date */}
              {feeDetails.paymentDetails?.dueDate && (
                <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm font-semibold text-yellow-400">Payment Due Date</p>
                  </div>
                  <p className="text-white font-bold">
                    {new Date(feeDetails.paymentDetails.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fee Structure Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-500" />
                Fee Structure Breakdown
              </h3>

              {/* Bar Chart */}
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={feeStructureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Bar dataKey="amount" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Fee Items Table */}
              <div className="space-y-2">
                {feeStructureData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600/20 p-2 rounded-lg">
                        <Receipt className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-white font-medium">{item.name} Fee</span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-lg border border-blue-500/30 mt-4">
                  <span className="text-white font-bold text-lg">Total Fee</span>
                  <span className="text-2xl font-bold text-blue-400">₹{totalFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-green-500" />
              Transaction History
            </h3>
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-lg">
              {feeDetails.transactions?.length || 0} Transactions
            </span>
          </div>

          <div className="p-6">
            {!feeDetails.transactions || feeDetails.transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feeDetails.transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-600/20 p-3 rounded-lg border border-green-500/30">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-1">Payment Successful</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(transaction.paymentDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {transaction.paymentMode}
                            </span>
                            <span className="text-gray-500">ID: {transaction.transactionId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">₹{transaction.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Receipt: {transaction.receiptNumber}</p>
                        </div>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all group-hover:scale-110">
                          <Download className="w-5 h-5 text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Payment Alert */}
        {amountPending > 0 && (
          <div className="bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-red-400 mb-2">Pending Payment</h4>
                <p className="text-gray-300 mb-4">
                  You have a pending amount of <span className="font-bold text-white">₹{amountPending.toLocaleString()}</span>. 
                  Please complete the payment before the due date to avoid late fees.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Fees;