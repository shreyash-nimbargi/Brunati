import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { famousPeopleService } from '../../../services/famousPeopleService';
import { toast } from 'react-hot-toast';

const FamousPeople = ({ isMobile }) => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';

    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        wearing: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        setIsLoading(true);
        try {
            const res = await famousPeopleService.getAll();
            if (res.status && res.data) {
                setPeople(res.data);
            }
        } catch (err) {
            toast.error('Failed to load famous people list');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (person = null) => {
        if (person) {
            setEditingPerson(person);
            setFormData({
                name: person.name || '',
                profession: person.profession || person.role || person.description || '',
                wearing: person.wearing || '',
                imageUrl: person.imageUrl || person.image || ''
            });
        } else {
            setEditingPerson(null);
            setFormData({ name: '', profession: '', wearing: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPerson(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.profession) {
            toast.error('Name and profession are required');
            return;
        }

        setIsSaving(true);
        try {
            if (editingPerson) {
                await famousPeopleService.update(editingPerson._id || editingPerson.id, formData);
                toast.success('Person updated successfully');
            } else {
                await famousPeopleService.create(formData);
                toast.success('Person added to directory');
            }
            fetchPeople();
            handleCloseModal();
        } catch (err) {
            toast.error('Failed to save entry');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this person from the site?')) return;

        // Optimistic State Update
        const previousPeople = [...people];
        setPeople(people.filter(p => (p._id || p.id) !== id));

        try {
            await famousPeopleService.delete(id);
            toast.success('Entry removed');
        } catch (err) {
            setPeople(previousPeople);
            toast.error('Failed to remove entry');
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Area */}
            <div className={`flex ${isMobile ? 'flex-col gap-4 text-center' : 'justify-between items-center'} mb-10`}>
                <div>
                    <h2 className="text-black font-bold leading-tight tracking-tight font-roboto text-2xl lg:text-3xl" style={{ textTransform: 'none', fontFamily: FONT_ROBOTO_BOLD }}>
                        Famous People
                    </h2>
                    <p className="text-gray-500 font-normal mt-1.5 font-roboto text-sm lg:text-base">
                        Manage your brand ambassadors and site influencers.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className={`bg-black text-white hover:bg-gray-800 transition-all rounded-xl font-bold flex items-center justify-center gap-2 ${isMobile ? 'w-full py-4' : 'py-3 px-8 text-sm'} shadow-lg shadow-black/10`}
                    style={{ fontFamily: FONT_ROBOTO_BOLD }}
                >
                    <Plus size={18} /> Add Person
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <span className="text-sm font-medium">Synchronizing influencers...</span>
                </div>
            ) : people.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <User size={32} className="text-gray-300 mb-4" />
                    <h3 className="font-bold text-black normal-case" style={{ fontFamily: FONT_ROBOTO_BOLD }}>No Entries Found</h3>
                    <p className="text-sm text-gray-500 mt-1">Add your first famous person entry to populate the storefront.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {people.map(person => (
                        <div key={person._id || person.id} className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(person)} className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-black hover:scale-110 rounded-full shadow-sm transition-all"><Edit2 size={14} strokeWidth={2} /></button>
                                <button onClick={() => handleDelete(person._id || person.id)} className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:scale-110 rounded-full shadow-sm transition-all"><Trash2 size={14} strokeWidth={2} /></button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                {/* Image Box */}
                                <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full mb-6 overflow-hidden flex items-center justify-center group-hover:border-black transition-all">
                                    {person.imageUrl || person.image ? (
                                        <img src={person.imageUrl || person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => e.target.src = ''} />
                                    ) : (
                                        <User size={32} className="text-gray-200" />
                                    )}
                                </div>
                                <p className="text-[12px] text-gray-400 font-normal normal-case tracking-widest mb-1" style={{ fontFamily: FONT_ROBOTO_REGULAR }}>
                                    {person.profession || person.role || 'Brand Influencer'}
                                </p>
                                <h4 className="font-bold text-black text-lg mb-2" style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}>
                                    {person.name}
                                </h4>
                                {person.wearing && (
                                    <p className="text-[10px] text-gray-500 font-bold tracking-tighter" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                        WEARING: {person.wearing.toUpperCase()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full md:w-[460px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-black" style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}>
                                {editingPerson ? 'Edit Person' : 'Add New Person'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block normal-case tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Full Name
                                </label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter personality name..."
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none font-roboto"
                                />
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block normal-case tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Profession / Role
                                </label>
                                <input 
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                                    placeholder="e.g. Actor, Musician..."
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none font-roboto"
                                />
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block normal-case tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Wearing (Perfume Name)
                                </label>
                                <input 
                                    type="text"
                                    value={formData.wearing}
                                    onChange={(e) => setFormData({...formData, wearing: e.target.value})}
                                    placeholder="e.g. ILLUMINATI"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none font-roboto"
                                />
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-bold text-gray-700 pl-1 mb-1.5 block normal-case tracking-wider" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                                    Image URL (Cloudinary)
                                </label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                        placeholder="https://cloudinary.com/..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-black transition-all text-sm outline-none font-roboto"
                                    />
                                </div>
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
                                    className={`flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSaving ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:bg-gray-900 shadow-xl'}`}
                                    style={{ fontFamily: FONT_ROBOTO_BOLD, textTransform: 'none' }}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : (editingPerson ? 'Save Changes' : 'Add Person')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamousPeople;
