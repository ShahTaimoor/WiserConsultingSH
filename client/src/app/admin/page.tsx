'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Mail, 
  User,
  TrendingUp,
  Activity,
  Home,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    portfolio: 0,
    team: 0,
    contacts: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const headers = { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        };
        
        const [portfolioRes, teamRes, contactsRes] = await Promise.all([
          fetch(`${API_URL}/portfolios`, { headers, credentials: 'include' }),
          fetch(`${API_URL}/team`, { headers, credentials: 'include' }),
          fetch(`${API_URL}/admin/contacts`, { headers, credentials: 'include' }),
        ]);

        const portfolio = await portfolioRes.json();
        const team = await teamRes.json();
        const contacts = await contactsRes.json();

        setStats({
          portfolio: portfolio.data?.length || 0,
          team: team.data?.length || 0,
          contacts: contacts.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Team', href: '/admin/team', icon: Users, color: 'bg-green-500' },
    { name: 'Content', href: '/admin/content', icon: FileText, color: 'bg-orange-500' },
    { name: 'Contact Submissions', href: '/admin/contacts', icon: Mail, color: 'bg-red-500' },
    { name: 'Users', href: '/admin/users', icon: User, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Manage your website content and submissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Portfolio Items</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{stats.portfolio}</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Team Members</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{stats.team}</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Submissions</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{stats.contacts}</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const colorMap: { [key: string]: { bg: string; icon: string; hover: string } } = {
              'bg-blue-500': { bg: 'bg-blue-50', icon: 'text-blue-500', hover: 'hover:bg-blue-100' },
              'bg-green-500': { bg: 'bg-green-50', icon: 'text-green-500', hover: 'hover:bg-green-100' },
              'bg-purple-500': { bg: 'bg-purple-50', icon: 'text-purple-500', hover: 'hover:bg-purple-100' },
              'bg-orange-500': { bg: 'bg-orange-50', icon: 'text-orange-500', hover: 'hover:bg-orange-100' },
              'bg-red-500': { bg: 'bg-red-50', icon: 'text-red-500', hover: 'hover:bg-red-100' },
              'bg-indigo-500': { bg: 'bg-indigo-50', icon: 'text-indigo-500', hover: 'hover:bg-indigo-100' },
            };
            const colors = colorMap[link.color] || colorMap['bg-blue-500'];
            return (
              <Link
                key={link.name}
                href={link.href}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-5 sm:p-6 flex items-center gap-4"
              >
                <div className={`${colors.bg} ${colors.hover} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} />
                </div>
                <span className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-gray-700 transition-colors">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
