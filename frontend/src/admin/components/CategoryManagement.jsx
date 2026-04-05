import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const FONT_ROBOTO = '"Roboto", sans-serif';

const CategoryHeader = ({ title }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: FONT_ROBOTO }}>
      {title}
    </h2>
    <p className="text-sm text-gray-500 font-normal mt-1" style={{ fontFamily: FONT_ROBOTO }}>
      Manage your product categories and their visibility.
    </p>
  </div>
);

const CategoryForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    isActive: true,
    image: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    onSubmit({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-6 animate-fadeIn transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: FONT_ROBOTO }}>Category Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none transition-all text-sm font-normal"
            style={{ fontFamily: FONT_ROBOTO }}
            placeholder="e.g. Men, Accessories"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: FONT_ROBOTO }}>Image URL (Optional)</label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none transition-all text-sm font-normal"
            style={{ fontFamily: FONT_ROBOTO }}
            placeholder="Cloudinary URL or placeholder"
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: FONT_ROBOTO }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none transition-all text-sm font-normal"
            style={{ fontFamily: FONT_ROBOTO }}
            placeholder="Brief description of the category..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          <label htmlFor="isActive" className="text-sm font-normal text-gray-700 cursor-pointer" style={{ fontFamily: FONT_ROBOTO }}>Active (Published)</label>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
          style={{ fontFamily: FONT_ROBOTO }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
          style={{ fontFamily: FONT_ROBOTO }}
        >
          {initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

const CategoryList = ({ categories, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
    {categories.map((cat) => (
      <div 
        key={cat._id} 
        className="group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
               {cat.image ? (
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-gray-300 text-xs font-bold uppercase">{cat.name[0]}</span>
               )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: FONT_ROBOTO }}>{cat.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`} style={{ fontFamily: FONT_ROBOTO }}>
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => onEdit(cat)} 
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
            >
              <Edit2 size={14} />
            </button>
            <button 
                onClick={() => onDelete(cat._id)} 
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-normal line-clamp-2 mt-2" style={{ fontFamily: FONT_ROBOTO }}>
          {cat.description || 'No description provided.'}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <code className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded font-mono">
            /{cat.slug}
          </code>
        </div>
      </div>
    ))}
  </div>
);

const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        { _id: '1', name: 'Men', slug: 'men', description: 'Men\'s luxury collection', isActive: true, image: '' },
        { _id: '2', name: 'Women', slug: 'women', description: 'Women\'s luxury collection', isActive: true, image: '' },
        { _id: '3', name: 'Unisex', slug: 'unisex', description: 'Unisex luxury collection', isActive: true, image: '' }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleCreate = (data) => {
        const newCat = { ...data, _id: Date.now().toString() };
        setCategories([...categories, newCat]);
        setShowForm(false);
    };

    const handleUpdate = (data) => {
        setCategories(categories.map(c => c._id === editingCategory._id ? { ...data, _id: c._id } : c));
        setEditingCategory(null);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c._id !== id));
        }
    };

    const startEdit = (cat) => {
        setEditingCategory(cat);
        setShowForm(true);
    };

    return (
        <div className="w-full border-b border-gray-100 pb-10 mb-10">
            <div className="flex justify-between items-center mb-6">
                <CategoryHeader title="Category Management" />
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow-sm hover:bg-gray-800 transition-all font-bold text-sm h-fit"
                        style={{ fontFamily: FONT_ROBOTO }}
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                )}
            </div>

            {showForm && (
                <CategoryForm 
                    onSubmit={editingCategory ? handleUpdate : handleCreate} 
                    onCancel={() => { setShowForm(false); setEditingCategory(null); }}
                    initialData={editingCategory}
                />
            )}

            <CategoryList 
                categories={categories} 
                onEdit={startEdit} 
                onDelete={handleDelete} 
            />

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CategoryManagement;
