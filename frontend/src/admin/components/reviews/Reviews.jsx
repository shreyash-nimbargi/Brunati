import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Loader2, X, Save } from 'lucide-react';
import { reviewService } from '../../../services/reviewService';
import { toast } from 'react-hot-toast';

const Reviews = ({ isMobile }) => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        reviewerName: '',
        rating: 5,
        reviewText: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const res = await reviewService.getAllReviews();
            if (res.status && res.data) {
                setReviews(res.data);
            }
        } catch (err) {
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (review = null) => {
        if (review) {
            setEditingReview(review);
            setFormData({
                reviewerName: review.reviewerName || review.name || '',
                rating: review.rating || 5,
                reviewText: review.reviewText || review.text || ''
            });
        } else {
            setEditingReview(null);
            setFormData({ reviewerName: '', rating: 5, reviewText: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.reviewerName || !formData.reviewText) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSaving(true);
        try {
            if (editingReview) {
                await reviewService.updateReview(editingReview._id || editingReview.id, formData);
                toast.success('Review updated');
            } else {
                await reviewService.createReview(formData);
                toast.success('Review added');
            }
            fetchReviews();
            handleCloseModal();
        } catch (err) {
            toast.error('Failed to save review');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        // Optimistic UI
        const previousReviews = [...reviews];
        setReviews(reviews.filter(r => (r._id || r.id) !== id));

        try {
            await reviewService.deleteReview(id);
            toast.success('Review deleted');
        } catch (err) {
            setReviews(previousReviews);
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-black font-bold leading-tight tracking-tight font-roboto text-2xl" style={{ textTransform: 'none', fontFamily: FONT_ROBOTO_BOLD }}>
                        Reviews
                    </h2>
                    <p className="text-gray-500 font-normal mt-1 font-roboto text-sm">
                        Manage customer testimonials and storefront feedback.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white hover:bg-gray-800 transition-all rounded-xl font-bold flex items-center justify-center gap-2 py-2.5 px-6 text-sm"
                    style={{ fontFamily: FONT_ROBOTO_BOLD }}
                >
                    <Plus size={18} /> Add Review
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <span className="text-sm">Fetching real-time feedback...</span>
                </div>
            ) : reviews.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <Star size={32} className="text-gray-300 mb-4" />
                    <h3 className="font-bold text-black" style={{ fontFamily: FONT_ROBOTO_BOLD }}>NO REVIEWS YET</h3>
                    <p className="text-sm text-gray-500 mt-1">Be the first to add a customer testimonial</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map(rev => (
                        <div key={rev._id || rev.id} className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-[16px] mb-1" style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}>
                                        {rev.reviewerName || rev.name}
                                    </h4>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={12} 
                                                fill={i < rev.rating ? "#FBBF24" : "none"} 
                                                className={i < rev.rating ? "text-[#FBBF24]" : "text-gray-200"} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(rev)}
                                        className="p-2 text-gray-400 hover:text-black hover:scale-110 transition-all cursor-pointer"
                                    >
                                        <Edit2 size={14} strokeWidth={2} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(rev._id || rev.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={14} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[14px] text-gray-600 font-normal leading-relaxed italic" style={{ fontFamily: FONT_ROBOTO_REGULAR }}>
                                "{rev.reviewText || rev.text}"
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full md:w-[460px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-black" style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}>
                                {editingReview ? 'Edit Review' : 'Add New Review'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block uppercase tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Customer Name
                                </label>
                                <input 
                                    type="text"
                                    value={formData.reviewerName}
                                    onChange={(e) => setFormData({...formData, reviewerName: e.target.value})}
                                    placeholder="e.g. Julian V."
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none"
                                />
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block uppercase tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Rating (1-5 Stars)
                                </label>
                                <div className="flex gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 justify-center">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({...formData, rating: star})}
                                            className="p-1 transition-all hover:scale-125"
                                        >
                                            <Star 
                                                size={24} 
                                                fill={star <= formData.rating ? "#FBBF24" : "none"} 
                                                className={star <= formData.rating ? "text-[#FBBF24]" : "text-gray-300"} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block uppercase tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Review Text
                                </label>
                                <textarea 
                                    value={formData.reviewText}
                                    onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                                    placeholder="Write the testimonial here..."
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none resize-none h-32"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-white text-gray-500 hover:text-black py-3 rounded-xl font-bold border border-gray-200 transition-all text-sm"
                                    style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className={`flex-[2] py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isSaving ? 'bg-gray-100 text-gray-400' : 'bg-black hover:bg-gray-900 shadow-xl'}`}
                                    style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : (editingReview ? 'Save Changes' : 'Add Review')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
