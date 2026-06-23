'use client';

import { useEffect, useState } from 'react';
import { Mail, Eye, Archive, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchContacts();
  }, [filterStatus]);

  const fetchContacts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const url = filterStatus === 'all' 
        ? `${API_URL}/admin/contacts`
        : `${API_URL}/admin/contacts?status=${filterStatus}`;
      const res = await fetch(url, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await res.json();
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {

      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      if (data.success) {
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status: status as any });
        }
      }
    } catch (error) {

    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete contact');
      }

      const data = await res.json();
      if (data.success) {
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }
      }
    } catch (error) {

    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'replied':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg w-full sm:w-auto"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {contacts.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions</h3>
                <p className="text-gray-500">Contact form submissions will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Subject</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className={`cursor-pointer hover:bg-gray-50 ${selectedContact?._id === contact._id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 sm:hidden">{contact.email}</div>
                        <div className="text-xs text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{contact.email}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-900 line-clamp-1">{contact.subject}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          <span className="hidden sm:inline">{contact.status}</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {selectedContact && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-0 max-h-[calc(100vh-120px)] lg:max-h-none overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Contact Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">
                  <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                    {selectedContact.phone}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => updateStatus(selectedContact._id, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
