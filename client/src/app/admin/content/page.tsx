'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

interface Content {
  _id?: string;
  page: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  sections?: any[];
  metadata?: any;
}

const AdminContent = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [formData, setFormData] = useState<Content>({
    page: 'home',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    sections: [],
    metadata: {},
  });

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage);
    }
  }, [selectedPage]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContents(data.data);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async (page: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/content/${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {

    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/content/${selectedPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Content saved successfully!');
        fetchContent();
      }
    } catch (error) {

      alert('Error saving content');
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full sm:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-base"
          >
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="services">Services</option>
          </select>
        </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={formData.heroTitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  placeholder="Enter hero subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                <textarea
                  value={formData.heroDescription || ''}
                  onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  rows={4}
                  placeholder="Enter hero description"
                />
              </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metadata (JSON format - optional)
            </label>
            <textarea
              value={JSON.stringify(formData.metadata || {}, null, 2)}
              onChange={(e) => {
                try {
                  const metadata = JSON.parse(e.target.value);
                  setFormData({ ...formData, metadata });
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              rows={6}
              placeholder='{"key": "value"}'
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContent;
