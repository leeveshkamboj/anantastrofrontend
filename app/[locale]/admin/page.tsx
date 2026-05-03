'use client';

import { useGetDashboardStatsQuery } from '@/store/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  FileCheck,
  FileX,
  FileClock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = data?.data;

  // Mock chart data - in real app, this would come from API
  const userGrowthData = [
    { name: 'Jan', users: 45, astrologers: 12 },
    { name: 'Feb', users: 52, astrologers: 15 },
    { name: 'Mar', users: 38, astrologers: 18 },
    { name: 'Apr', users: 24, astrologers: 20 },
    { name: 'May', users: 33, astrologers: 22 },
    { name: 'Jun', users: 26, astrologers: 25 },
  ];

  const requestStatusData = [
    { name: 'Pending', value: stats?.pendingRequests || 0, color: '#fbbf24' },
    { name: 'Approved', value: stats?.approvedRequests || 0, color: '#10b981' },
    { name: 'Rejected', value: stats?.rejectedRequests || 0, color: '#ef4444' },
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Admins',
      value: stats?.totalAdmins || 0,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Astrologers',
      value: stats?.totalAstrologers || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Regular Users',
      value: stats?.totalRegularUsers || 0,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: FileClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      urgent: (stats?.pendingRequests || 0) > 0,
    },
    {
      title: 'Approved Requests',
      value: stats?.approvedRequests || 0,
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected Requests',
      value: stats?.rejectedRequests || 0,
      icon: FileX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1.5">Welcome back! Here's an overview of your platform</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.slice(0, 4).map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} border ${stat.bgColor.replace('bg-', 'border-').replace('-50', '-100')}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                {stat.trend && (
                  <div className="flex items-center text-xs mt-2">
                    {stat.trendUp ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-red-600 mr-1.5" />
                    )}
                    <span className={stat.trendUp ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {stat.trend}
                    </span>
                    <span className="text-gray-500 ml-1.5">vs last month</span>
                  </div>
                )}
                {stat.urgent && (
                  <div className="text-xs text-amber-600 mt-2 font-semibold flex items-center gap-1">
                    <FileClock className="w-3 h-3" />
                    Action required
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Growth Chart */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">User Growth</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Monthly user and astrologer growth trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="users" fill="#3b82f6" name="Users" radius={[8, 8, 0, 0]} />
                <Bar dataKey="astrologers" fill="#10b981" name="Astrologers" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Status Chart */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Request Status Overview</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Distribution of astrologer registration requests</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.slice(4).map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} border ${stat.bgColor.replace('bg-', 'border-').replace('-50', '-100')}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                {stat.urgent && (
                  <div className="text-xs text-amber-600 mt-2 font-semibold flex items-center gap-1">
                    <FileClock className="w-3 h-3" />
                    Action required
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
