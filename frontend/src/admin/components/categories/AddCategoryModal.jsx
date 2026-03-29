import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const AddCategoryModal = ({ isOpen, onClose, onSave, editingCategory }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (editingCategory) {
            setName(typeof editingCategory === 'string' ? editingCategory : editingCategory.name);
        } else {
            setName('');
        }
    }, [editingCategory, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name.trim(), editingCategory?._id);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 font-roboto">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-black">
                        {editingCategory ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 group">
                        <X size={18} className="group-hover:text-black transition-colors" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-8">
                        <label className="text-[12px] font-normal text-gray-600 block mb-2.5 pl-1">Category Name</label>
                        <input 
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. For Him"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-black rounded-xl outline-none transition-all font-normal text-sm text-gray-800 placeholder:text-gray-300 shadow-sm focus:shadow-md"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-4 bg-black text-white hover:bg-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10 active:scale-95"
                    >
                        <Save size={18} /> {editingCategory ? 'Update' : 'Add'} Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;
