import React, { useState, useEffect } from 'react';
import { X, Camera, Save, ArrowRight, Trash2 } from 'lucide-react';

const AddBannerModal = ({ isOpen, onClose, onSave, editingBanner }) => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        link: '',
        priority: 1,
        active: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (editingBanner) {
            setFormData({
                title: editingBanner.title || '',
                subtitle: editingBanner.subtitle || '',
                link: editingBanner.link || '',
                priority: editingBanner.priority || 1,
                active: editingBanner.active !== undefined ? editingBanner.active : true
            });
            const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            setPreviewUrl(editingBanner.imageUrl?.startsWith('http') 
                ? editingBanner.imageUrl 
                : `${backendUrl}/${editingBanner.imageUrl}`);
        } else {
            setFormData({
                title: '',
                subtitle: '',
                link: '',
                priority: 1,
                active: true
            });
            setImageFile(null);
            setPreviewUrl('');
        }
    }, [editingBanner, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Image is mandatory
        if (!imageFile && !editingBanner?.imageUrl) {
            return;
        }

        const data = new FormData();
        // Title and Subtitle are optional, send "" if blank
        data.append('title', formData.title || "");
        data.append('subtitle', formData.subtitle || "");
        data.append('link', formData.link || "");
        data.append('priority', formData.priority || 1);
        data.append('active', formData.active);
        
        if (imageFile) {
            data.append('image', imageFile);
        }
        
        onSave(data, editingBanner?._id || editingBanner?.id);
    };

    const isSaveDisabled = !previewUrl;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Body */}
            <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xl font-bold tracking-tight text-black" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                        {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-black"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white font-roboto">
                    {/* Image Upload Area */}
                    <div className="relative group">
                        <input 
                            type="file" 
                            id="banner-image" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <label 
                            htmlFor="banner-image"
                            className={`
                                relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed 
                                transition-all cursor-pointer overflow-hidden
                                ${previewUrl ? 'border-transparent h-56' : 'border-gray-200 h-40 bg-gray-50/30 hover:bg-gray-50 hover:border-black'}
                            `}
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <Camera className="text-gray-400 group-hover:text-black transition-colors" size={20} />
                                    </div>
                                    <span className="text-xs font-normal text-gray-500 group-hover:text-black">
                                        Upload banner photo (Required)
                                    </span>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[12px] font-normal text-gray-600 pl-1 mb-2 block">
                                Banner Title
                            </label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter title (optional)"
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-normal text-gray-800 placeholder:text-gray-300"
                            />
                        </div>

                        <div className="group">
                            <label className="text-[12px] font-normal text-gray-600 pl-1 mb-2 block">
                                Description
                            </label>
                            <textarea 
                                value={formData.subtitle}
                                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                placeholder="Short description (optional)..."
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-normal text-gray-800 placeholder:text-gray-300 resize-none h-24"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 group">
                                <label className="text-[12px] font-normal text-gray-600 pl-1 mb-2 block">
                                    Link
                                </label>
                                <input 
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                    placeholder="/shop"
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-normal text-gray-800 placeholder:text-gray-300"
                                />
                            </div>
                            <div className="w-24 group">
                                <label className="text-[12px] font-normal text-gray-600 pl-1 mb-2 block">
                                    Priority
                                </label>
                                <input 
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-normal text-gray-800 text-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white text-gray-400 hover:text-black hover:border-black py-4 rounded-xl font-bold border border-gray-100 transition-all text-sm"
                            style={{ fontFamily: FONT_ROBOTO_BOLD }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaveDisabled}
                            className={`flex-[2] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSaveDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5'}`}
                            style={{ fontFamily: FONT_ROBOTO_BOLD }}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {editingBanner ? 'Save Changes' : 'Add Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddBannerModal;
