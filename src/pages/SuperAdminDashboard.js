import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  School,
  BookOpen,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SuperAdminDashboard = () => {
  const { t, language } = useApp();

  // Static data for the dashboard
  const stats = {
    totalTeachers: 150,
    totalSchools: 45,
    totalBookings: 320,
    pendingTeachers: 25,
    activeTeachers: 125,
    totalRevenue: 75000,
    topCities: [
      { name: 'Riyadh', value: 45 },
      { name: 'Jeddah', value: 30 },
      { name: 'Dammam', value: 15 },
      { name: 'Mecca', value: 10 }
    ],
    topSubjects: [
      { name: 'Mathematics', value: 40 },
      { name: 'Science', value: 35 },
      { name: 'English', value: 25 },
      { name: 'Arabic', value: 20 }
    ],
    bookingsTrend: [
      { month: 'Jan', bookings: 25 },
      { month: 'Feb', bookings: 35 },
      { month: 'Mar', bookings: 45 },
      { month: 'Apr', bookings: 40 },
      { month: 'May', bookings: 55 },
      { month: 'Jun', bookings: 50 }
    ],
    teacherStatusDistribution: [
      { name: 'Active', value: 125 },
      { name: 'Pending', value: 25 },
      { name: 'Inactive', value: 10 }
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 10000 },
      { month: 'Feb', revenue: 12000 },
      { month: 'Mar', revenue: 15000 },
      { month: 'Apr', revenue: 13000 },
      { month: 'May', revenue: 16000 },
      { month: 'Jun', revenue: 14000 }
    ],
    transactions: {
      total: {
        successful: 850,
        failed: 120,
        pending: 30,
        refunded: 45
      },
      lastSixMonths: [
        { month: 'Jan', successful: 120, failed: 15, pending: 5, refunded: 8 },
        { month: 'Feb', successful: 145, failed: 18, pending: 4, refunded: 7 },
        { month: 'Mar', successful: 165, failed: 22, pending: 6, refunded: 9 },
        { month: 'Apr', successful: 155, failed: 20, pending: 5, refunded: 6 },
        { month: 'May', successful: 180, failed: 25, pending: 7, refunded: 8 },
        { month: 'Jun', successful: 185, failed: 20, pending: 3, refunded: 7 }
      ]
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const TRANSACTION_COLORS = {
    successful: '#10B981', // green
    failed: '#EF4444',    // red
    pending: '#F59E0B',   // yellow
    refunded: '#6B7280'   // gray
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('dashboard')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('dashboardDesc')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Teachers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('totalTeachers')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stats.totalTeachers}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Schools */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('totalSchools')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stats.totalSchools}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
              <School className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('totalBookings')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stats.totalBookings}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('totalRevenue')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stats.totalRevenue.toLocaleString()} SAR
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Transaction Statistics */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Total Transactions */}
            <div className="w-full lg:w-[30%] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('totalTransactions')}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: t('successful'), value: stats.transactions.total.successful },
                        { name: t('failed'), value: stats.transactions.total.failed },
                        { name: t('pending'), value: stats.transactions.total.pending },
                        { name: t('refunded'), value: stats.transactions.total.refunded }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value, percent }) => {
                        const formattedPercent = (percent * 100).toFixed(0);
                        return language === 'ar' 
                          ? `${name} (${value})`
                          : `${name} (${value})`;
                      }}
                      outerRadius={80}
                      innerRadius={40}
                      startAngle={language === 'ar' ? -270 : 90}
                      endAngle={language === 'ar' ? -630 : -270}
                      paddingAngle={5}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={TRANSACTION_COLORS.successful} />
                      <Cell fill={TRANSACTION_COLORS.failed} />
                      <Cell fill={TRANSACTION_COLORS.pending} />
                      <Cell fill={TRANSACTION_COLORS.refunded} />
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => {
                        const percent = (value / (stats.transactions.total.successful + 
                          stats.transactions.total.failed + 
                          stats.transactions.total.pending + 
                          stats.transactions.total.refunded) * 100).toFixed(1);
                        return language === 'ar' 
                          ? [`${value} (${percent}%)`, name]
                          : [`${value} (${percent}%)`, name];
                      }}
                      contentStyle={{
                        direction: language === 'ar' ? 'rtl' : 'ltr',
                        textAlign: language === 'ar' ? 'right' : 'left'
                      }}
                    />
                    <Legend 
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      formatter={(value) => (
                        <span style={{ 
                          direction: language === 'ar' ? 'rtl' : 'ltr',
                          display: 'inline-block',
                          marginLeft: language === 'ar' ? '0' : '10px',
                          marginRight: language === 'ar' ? '10px' : '0'
                        }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalVolume')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {(stats.transactions.total.successful + stats.transactions.total.failed + 
                      stats.transactions.total.pending + stats.transactions.total.refunded).toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <p className="text-sm text-green-600 dark:text-green-400">{t('successRate')}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {(stats.transactions.total.successful / 
                      (stats.transactions.total.successful + stats.transactions.total.failed + 
                        stats.transactions.total.pending + stats.transactions.total.refunded) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Last 6 Months Transactions */}
            <div className="w-full lg:w-[70%] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('last6MonthsTransactions')}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.transactions.lastSixMonths}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successful" name={t('successful')} fill={TRANSACTION_COLORS.successful} stackId="a" />
                    <Bar dataKey="failed" name={t('failed')} fill={TRANSACTION_COLORS.failed} stackId="a" />
                    <Bar dataKey="pending" name={t('pending')} fill={TRANSACTION_COLORS.pending} stackId="a" />
                    <Bar dataKey="refunded" name={t('refunded')} fill={TRANSACTION_COLORS.refunded} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('monthlyAverage')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {Math.round(stats.transactions.lastSixMonths.reduce((acc, month) => 
                      acc + month.successful + month.failed + month.pending + month.refunded, 0) / 6).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t('trend')}</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {((stats.transactions.lastSixMonths[5].successful / 
                      stats.transactions.lastSixMonths[0].successful - 1) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bookings Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('bookingsTrend')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.bookingsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Month */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('revenueByMonth')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('topCities')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topCities}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.topCities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Teacher Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('teacherStatusDistribution')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.teacherStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.teacherStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Teacher Stats Section - Moved to bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Teachers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('pendingTeachers')}
            </h3>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.pendingTeachers}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('teachersAwaitingApproval')}
          </p>
        </div>

        {/* Active Teachers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('activeTeachers')}
            </h3>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.activeTeachers}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('currentlyActiveTeachers')}
          </p>
        </div>

        {/* Top Subjects */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('topSubjects')}
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="space-y-4">
            {stats.topSubjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {subject.name}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {subject.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 