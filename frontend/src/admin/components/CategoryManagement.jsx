import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const FONT_ROBOTO = '"Roboto", sans-serif';

const CategoryHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: '"Roboto", sans-serif' }}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm text-gray-500 font-normal mt-1" style={{ fontFamily: '"Roboto", sans-serif' }}>
        {subtitle}
      </p>
    )}
  </div>
);

const CategoryForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    slug: '',
    isActive: true,
    image: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Auto-generate slug from name if name changes and slug wasn't manually edited or is empty
    if (name === 'name') {
        const slug = value.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({
            ...prev,
            name: value,
            slug: slug
        }));
        return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full md:max-w-[460px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg text-black" style={{ fontFamily: '"Roboto", sans-serif' }}>
            {initialData ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif' }}>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="admin-input w-full p-3 text-sm focus:ring-1 focus:ring-black"
              placeholder="e.g. Men's Fragrance"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif' }}>Slug (URL Path)</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="admin-input w-full p-3 text-sm bg-gray-50/30 text-gray-600"
              placeholder="men-fragrance"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Roboto", sans-serif' }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="admin-input w-full p-3 text-sm resize-none"
              placeholder="Brief description of this collection..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-black cursor-pointer rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer" style={{ fontFamily: '"Roboto", sans-serif' }}>
              Show in store browsing
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              style={{ fontFamily: '"Roboto", sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-bold bg-black text-white rounded-lg hover:opacity-90 shadow-lg shadow-black/10 transition-all"
              style={{ fontFamily: '"Roboto", sans-serif' }}
            >
              {initialData ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryList = ({ categories, onEdit, onDelete, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
    {categories.map((cat) => (
      <div 
        key={cat._id} 
        onClick={() => onSelect(cat.name)}
        className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-black/10 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
               {cat.image ? (
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-gray-300 text-sm font-bold uppercase">{cat.name[0]}</span>
               )}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide leading-tight" style={{ fontFamily: '"Roboto", sans-serif' }}>{cat.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`} style={{ fontFamily: '"Roboto", sans-serif' }}>
                    {cat.isActive ? 'Active' : 'Private'}
                </span>
                <code className="text-[10px] text-gray-400 font-mono">/{cat.slug}</code>
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100">
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(cat); }} 
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(cat); }} 
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-normal line-clamp-2 mt-3 leading-relaxed" style={{ fontFamily: '"Roboto", sans-serif' }}>
          {cat.description || 'No description provided.'}
        </p>
      </div>
    ))}
  </div>
);

const CategoryManagement = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([
        { _id: '1', name: 'Men', slug: 'men', description: 'Exclusive collection for men', isActive: true, image: '' },
        { _id: '2', name: 'Women', slug: 'women', description: 'Curated elegance for women', isActive: true, image: '' },
        { _id: '3', name: 'Unisex', slug: 'unisex', description: 'Shared scents for everyone', isActive: true, image: '' }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleCreate = (data) => {
        const newCat = { 
            ...data, 
            _id: Date.now().toString(),
            slug: data.slug || data.name.toLowerCase().replace(/ /g, '-')
        };
        setCategories([...categories, newCat]);
        setShowForm(false);
    };

    const handleUpdate = (data) => {
        setCategories(categories.map(c => c._id === editingCategory._id ? { ...data, _id: c._id } : c));
        setEditingCategory(null);
        setShowForm(false);
    };

    const handleDelete = (category) => {
        setConfirmDelete(category);
    };

    const executeDelete = () => {
        setCategories(categories.filter(c => c._id !== confirmDelete._id));
        setConfirmDelete(null);
    };

    const startEdit = (cat) => {
        setEditingCategory(cat);
        setShowForm(true);
    };

    return (
        <div className="w-full border-b border-gray-100 pb-12 mb-12">
            <div className="flex justify-between items-center mb-8">
                <CategoryHeader 
                    title="Product Categories" 
                    subtitle="Organize your inventory by high-level collections."
                />
                <button 
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg shadow-lg shadow-black/10 hover:bg-gray-800 transition-all font-bold text-sm h-fit"
                    style={{ fontFamily: '"Roboto", sans-serif' }}
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <CategoryList 
                categories={categories} 
                onEdit={startEdit} 
                onDelete={handleDelete}
                onSelect={onCategorySelect}
            />

            {showForm && (
                <CategoryForm 
                    onSubmit={editingCategory ? handleUpdate : handleCreate} 
                    onCancel={() => { setShowForm(false); setEditingCategory(null); }}
                    initialData={editingCategory}
                />
            )}

            {/* Confirm Delete Popup */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 max-w-[400px] w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>Confirm Delete</h3>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed" style={{ fontFamily: '"Roboto", sans-serif' }}>
                            Are you sure you want to delete <span className="font-bold text-black uppercase">{confirmDelete.name}</span>? 
                            This will remove the category from all products.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                                style={{ fontFamily: '"Roboto", sans-serif' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="flex-1 px-4 py-3 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all"
                                style={{ fontFamily: '"Roboto", sans-serif' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default CategoryManagement;
