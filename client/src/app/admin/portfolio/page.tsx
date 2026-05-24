'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Portfolio {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  link: string;
  order: number;
  isActive: boolean;
}

const AdminPortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web',
    image: '🛒',
    technologies: [] as string[],
    link: '',
    order: 0,
    isActive: true,
  });
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/portfolios`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch portfolios');
      }
      
      const data = await res.json();
      if (data.success) {
        setPortfolios(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const url = editingPortfolio
        ? `${API_URL}/admin/portfolios/${editingPortfolio._id}`
        : `${API_URL}/admin/portfolios`;
      const method = editingPortfolio ? 'PUT' : 'POST';

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('link', formData.link || '');
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      // Append technologies array
      formData.technologies.forEach((tech, index) => {
        formDataToSend.append(`technologies[${index}]`, tech);
      });
      
      // Append image file if selected, otherwise append existing image URL or emoji
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.image && !formData.image.startsWith('http')) {
        // If it's an emoji or text, send it as a regular field
        formDataToSend.append('image', formData.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save project');
      }

      const data = await res.json();
      if (data.success) {
        fetchPortfolios();
        setShowModal(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error instanceof Error ? error.message : 'Failed to save project. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/portfolios/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      const data = await res.json();
      if (data.success) {
        fetchPortfolios();
      } else {
        throw new Error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project. Please try again.');
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      image: portfolio.image,
      technologies: portfolio.technologies,
      link: portfolio.link,
      order: portfolio.order,
      isActive: portfolio.isActive,
    });
    // Set image preview if it's a URL, otherwise clear it
    if (portfolio.image && (portfolio.image.startsWith('http') || portfolio.image.startsWith('/'))) {
      setImagePreview(portfolio.image);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'web',
      image: '🛒',
      technologies: [],
      link: '',
      order: 0,
      isActive: true,
    });
    setEditingPortfolio(null);
    setTechInput('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {portfolios.map((portfolio) => (
          <div key={portfolio._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {portfolio.image && (portfolio.image.startsWith('http') || portfolio.image.startsWith('/')) ? (
                  <img
                    src={portfolio.image}
                    alt={portfolio.title}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="text-3xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">{portfolio.image || '🛒'}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{portfolio.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{portfolio.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {portfolio.category}
                  </span>
                  {portfolio.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <Eye className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <EyeOff className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
                {portfolio.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 rounded text-gray-700">
                        {tech}
                      </span>
                    ))}
                    {portfolio.technologies.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded text-gray-700">
                        +{portfolio.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technologies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolios.map((portfolio) => (
              <tr key={portfolio._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                  {portfolio.image && (portfolio.image.startsWith('http') || portfolio.image.startsWith('/')) ? (
                    <img
                      src={portfolio.image}
                      alt={portfolio.title}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                      <div className="text-2xl">{portfolio.image || '🛒'}</div>
                  )}
                </td>
                  <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{portfolio.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{portfolio.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {portfolio.category}
                    </span>
                </td>
                  <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {tech}
                      </span>
                    ))}
                    {portfolio.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                        +{portfolio.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  {portfolio.isActive ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Eye className="w-4 h-4" />
                        <span>Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400">
                      <EyeOff className="w-4 h-4" />
                        <span>Inactive</span>
                    </span>
                  )}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(portfolio)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      aria-label="Delete"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingPortfolio ? 'Edit Portfolio' : 'Add Portfolio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  {!imagePreview && formData.image && !formData.image.startsWith('http') && (
                    <div className="mt-2 text-4xl">{formData.image}</div>
                  )}
                  {!imagePreview && formData.image && formData.image.startsWith('http') && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Or use emoji:</label>
                    <input
                      type="text"
                      value={formData.image && !formData.image.startsWith('http') ? formData.image : ''}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="🛒"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add technology"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingPortfolio ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
