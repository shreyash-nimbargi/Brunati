import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { userService } from '../../services/userService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

const CheckoutFlow = ({ isOpen, onClose, isDirectBuy = false, directBuyProduct = null }) => {
    const navigate = useNavigate();
    const { cartItems, getSubtotal, clearCart } = useCart();
    
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    
    const [availableSamples, setAvailableSamples] = useState([]);
    const [selectedGift, setSelectedGift] = useState(null);
    const [orderID, setOrderID] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({
        name: "", phone: "", alternatePhone: "", email: "", address1: "", city: "", state: "", pin: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateAddress = (addr) => {
        const errors = {};
        if (!addr.name.trim() || addr.name.trim().length < 2)
            errors.name = 'Full name must be at least 2 characters.';
        else if (!/^[a-zA-Z\s.'-]+$/.test(addr.name.trim()))
            errors.name = 'Name can only contain letters, spaces, or . \' -';
        const phoneDigits = addr.phone.replace(/[\s+\-()]/g, '');
        if (!phoneDigits)
            errors.phone = 'Phone number is required.';
        else if (!/^(91)?[6-9]\d{9}$/.test(phoneDigits))
            errors.phone = 'Enter a valid 10-digit Indian mobile number.';

        if (addr.alternatePhone) {
            const altPhoneDigits = addr.alternatePhone.replace(/[\s+\-()]/g, '');
            if (altPhoneDigits && !/^(91)?[6-9]\d{9}$/.test(altPhoneDigits))
                errors.alternatePhone = 'Enter a valid 10-digit Indian mobile number.';
        }

        if (!addr.email.trim())
            errors.email = 'Email address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email.trim()))
            errors.email = 'Enter a valid email address.';
        if (!addr.address1.trim() || addr.address1.trim().length < 5)
            errors.address1 = 'Address must be at least 5 characters.';
        if (!addr.city.trim() || addr.city.trim().length < 2)
            errors.city = 'City is required (min 2 characters).';
        else if (!/^[a-zA-Z\s]+$/.test(addr.city.trim()))
            errors.city = 'City name can only contain letters.';
        if (!addr.state.trim() || addr.state.trim().length < 2)
            errors.state = 'State is required (min 2 characters).';
        else if (!/^[a-zA-Z\s]+$/.test(addr.state.trim()))
            errors.state = 'State name can only contain letters.';
        if (!addr.pin.trim())
            errors.pin = 'Pincode is required.';
        else if (!/^[1-9][0-9]{5}$/.test(addr.pin.trim()))
            errors.pin = 'Enter a valid 6-digit Indian pincode.';
        return errors;
    };

    const getImgSrc = (src) => {
        if (!src) return '/media/dominus/1.png';
        return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
    };

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            if (isDirectBuy) {
                setIsGiftModalOpen(true);
                setIsAddressModalOpen(false);
            } else {
                setIsGiftModalOpen(false);
                setIsAddressModalOpen(true);
            }
        } else {
            setIsGiftModalOpen(false);
            setIsAddressModalOpen(false);
            setIsCheckoutModalOpen(false);
            setIsSuccessModalOpen(false);
            setIsAddressFormOpen(false);
            setSelectedGift(null);
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            const authRes = await userService.checkAuth();
            if (authRes.status && authRes.isLoggedIn) {
                setIsLoggedIn(true);
                if (authRes.data && authRes.data.addresses && authRes.data.addresses.length > 0) {
                    const mappedAddrs = authRes.data.addresses.map((backendAddr, idx) => ({
                        name: backendAddr.name || authRes.data.name || 'Saved Address',
                        phone: backendAddr.phone || authRes.data.phone || '',
                        alternatePhone: backendAddr.alternatePhone || '',
                        email: authRes.data.email || '',
                        address1: backendAddr.street || '',
                        city: backendAddr.city || '',
                        state: backendAddr.state || '',
                        pin: backendAddr.pincode || ''
                    }));
                    setAddresses(mappedAddrs);
                    setSelectedAddressIndex(0);
                }
            } else {
                setIsLoggedIn(false);
            }

            if (isDirectBuy) {
                const samplesRes = await productService.getAvailableSamples();
                if (samplesRes.status) {
                    setAvailableSamples(samplesRes.data.samples || []);
                }
            }
        } catch (err) {
            setIsLoggedIn(false);
        }
    };

    const handleProceedFromGift = () => {
        if (!selectedGift) {
            toast.error("Please select a free gift sample");
            return;
        }
        if (!isLoggedIn) {
            toast.error("Please sign in to proceed with your order", {
                duration: 3000, position: 'top-center', style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
            return;
        }
        setIsGiftModalOpen(false);
        setIsAddressModalOpen(true);
    };

    const handleProceedFromAddress = () => {
        if (!isLoggedIn) {
             toast.error("Please sign in to proceed with your order", {
                duration: 3000, position: 'top-center', style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
            return;
        }
        if (addresses.length === 0) {
            toast.error("Please add a shipping address");
            return;
        }
        setIsAddressModalOpen(false);
        setIsCheckoutModalOpen(true);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            let items = [];
            let totalAmount = 0;

            if (isDirectBuy) {
                items = [{
                    product: directBuyProduct.id,
                    name: directBuyProduct.name,
                    quantity: 1,
                    price: directBuyProduct.price,
                    size: directBuyProduct.size
                }];
                totalAmount = directBuyProduct.price;
            } else {
                items = cartItems.map(item => ({
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                }));
                totalAmount = getSubtotal();
            }

            if (items.length === 0) {
                 toast.error("No items to process!");
                 setLoading(false);
                 return;
            }

            const address = addresses[selectedAddressIndex];
            const sample = availableSamples.find(s => (s.productId?.name || 'Brunati Sample') === selectedGift);

            const orderData = {
                items: items.map(item => ({
                    productId: item.productId || item.product || item.id,
                    size: item.size,
                    quantity: item.quantity
                })),
                sampleId: sample ? sample._id : null,
                shippingAddress: {
                    name: address.name,
                    phone: address.phone,
                    alternatePhone: address.alternatePhone,
                    street: address.address1,
                    city: address.city,
                    state: address.state,
                    pincode: address.pin
                },
                totalAmount,
                paymentMethod: "COD"
            };

            const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
            for (let item of orderData.items) {
                if (!isValidObjectId(item.productId)) {
                    toast.error(`Legacy product mapping found. Your cart has been reset for compatibility.`);
                    clearCart();
                    setIsCheckoutModalOpen(false);
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await orderService.createOrder(orderData);
                if (response && response.status) {
                    setOrderID(response.data?.orderId);
                    if (!isDirectBuy) clearCart();
                    setIsCheckoutModalOpen(false);
                    setIsSuccessModalOpen(true);
                } else {
                    throw new Error(response.message || "Failed to place order.");
                }
            } catch (apiError) {
                const errMsg = apiError.response?.data?.message || apiError.message || "Something went wrong! Please try again.";
                toast.error(errMsg);
            }
        } catch (error) {
            toast.error("Failed to process order.");
        } finally {
            setLoading(false);
        }
    };

    const closeAll = () => {
        setIsGiftModalOpen(false);
        setIsAddressModalOpen(false);
        setIsCheckoutModalOpen(false);
        setIsSuccessModalOpen(false);
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="product-page-wrapper" style={{ display: 'contents' }}>
            {/* Gift Modal */}
            {isGiftModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content gift-modal">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={closeAll}></ion-icon>
                        <h2 className="modal-title">Select Your Free Gift</h2>
                        <p className="modal-subtitle">Choose 1 complimentary sample</p>

                        <div className="sample-list">
                            {availableSamples.length > 0 ? (
                                availableSamples.map((sample) => (
                                    <div
                                        key={sample._id}
                                        className={`sample-item ${selectedGift === (sample.productId?.name || 'Brunati Sample') ? 'selected' : ''}`}
                                        onClick={() => setSelectedGift(sample.productId?.name || 'Brunati Sample')}
                                    >
                                        <div className="radio-icon">
                                            <div className="radio-inner"></div>
                                        </div>
                                        <img src={getImgSrc(sample.productId?.images?.[0] || 'media/dominus/1.png')} alt={sample.productId?.name} className="sample-img" />
                                        <span className="sample-name">{sample.productId?.name || 'Brunati Sample'}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#6e6e73', textAlign: 'center', width: '100%', padding: '20px' }}>No samples available at the moment.</p>
                            )}
                        </div>

                        <button className="buy-now-cta full-width-btn" style={{ marginTop: '20px' }} onClick={handleProceedFromGift}>Continue</button>
                    </div>
                </div>
            )}

            {/* Address Selection Modal */}
            {isAddressModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content address-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Select Address</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button className="add-new-btn" onClick={() => {
                                    setCurrentAddress({ name: "", phone: "", alternatePhone: "", email: "", address1: "", city: "", state: "", pin: "" });
                                    setIsEditing(false);
                                    setIsAddressFormOpen(true);
                                }}>Add New</button>
                                <button className="modal-close-btn" onClick={closeAll} aria-label="Close">✕</button>
                            </div>
                        </div>

                        <div className="address-scroll-container">
                            {addresses.length > 0 ? (
                                addresses.map((addr, idx) => (
                                    <div key={idx} className={`address-card ${selectedAddressIndex === idx ? 'selected' : ''}`}>
                                        <h4 className="card-heading">{idx === 0 && addresses.length === 1 ? 'Saved Address' : `Address ${idx + 1}`}</h4>
                                        <div className="card-content">
                                            <div className="radio-group" onClick={() => setSelectedAddressIndex(idx)}>
                                                <input type="radio" id={`addr${idx}`} name="address" checked={selectedAddressIndex === idx} readOnly />
                                                <label htmlFor={`addr${idx}`}>
                                                    <div className="recipient-row">
                                                        <span className="recipient-name">{addr.name}</span>
                                                        {idx === 0 && <ion-icon name="star" className="star-icon" style={{ color: '#FFD700', fontSize: '1.2rem' }}></ion-icon>}
                                                    </div>
                                                    <div className="address-details">
                                                        <p>{addr.address1}</p>
                                                        <p>{[addr.city, addr.state].filter(Boolean).join(', ')}</p>
                                                        <p>PIN: {addr.pin}</p>
                                                    </div>
                                                    <div className="contact-info">
                                                        <p>{addr.phone}</p>
                                                        {addr.alternatePhone && <p>{addr.alternatePhone}</p>}
                                                        <p>{addr.email}</p>
                                                    </div>
                                                </label>
                                            </div>
                                            <button className="edit-btn" onClick={() => {
                                                setCurrentAddress(addr);
                                                setIsEditing(true);
                                                setEditIndex(idx);
                                                setIsAddressFormOpen(true);
                                            }}>
                                                <ion-icon name="pencil-outline"></ion-icon>
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-address-message" style={{ padding: '30px 20px', textAlign: 'center', background: '#f5f5f7', borderRadius: '12px', color: '#6e6e73' }}>
                                    <ion-icon name="location-outline" style={{ fontSize: '32px', marginBottom: '10px' }}></ion-icon>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>No saved addresses found.</p>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem' }}>Please click "Add New" above to register your shipping location.</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer sticky-footer">
                            <button className="buy-now-cta full-width-btn" onClick={handleProceedFromAddress}>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Form Modal */}
            {isAddressFormOpen && (
                <div className="modal-overlay active form-overlay">
                    <div className="modal-content address-form-modal">
                        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 className="modal-title">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                            <button className="modal-close-btn" onClick={() => setIsAddressFormOpen(false)} aria-label="Close">✕</button>
                        </div>

                        <form className="address-form" onSubmit={(e) => {
                            e.preventDefault();
                            setTouched({ name: true, phone: true, email: true, address1: true, city: true, state: true, pin: true });
                            const errors = validateAddress(currentAddress);
                            setFormErrors(errors);
                            if (Object.keys(errors).length > 0) return;
                            if (isEditing) {
                                const newAddrs = [...addresses];
                                newAddrs[editIndex] = currentAddress;
                                setAddresses(newAddrs);
                            } else {
                                setAddresses([...addresses, currentAddress]);
                                setSelectedAddressIndex(addresses.length);
                            }
                            setFormErrors({});
                            setTouched({});
                            setIsAddressFormOpen(false);
                        }}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Full Name</label>
                                    <input type="text" value={currentAddress.name} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, name: val }); if (touched.name) setFormErrors(prev => ({ ...prev, name: validateAddress({ ...currentAddress, name: val }).name })); }} onBlur={() => { setTouched(prev => ({ ...prev, name: true })); setFormErrors(prev => ({ ...prev, name: validateAddress(currentAddress).name })); }} placeholder="Enter full name" style={touched.name && formErrors.name ? { borderColor: '#e03030' } : {}} />
                                    {touched.name && formErrors.name && <span className="field-error">{formErrors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={currentAddress.phone} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, phone: val }); if (touched.phone) setFormErrors(prev => ({ ...prev, phone: validateAddress({ ...currentAddress, phone: val }).phone })); }} onBlur={() => { setTouched(prev => ({ ...prev, phone: true })); setFormErrors(prev => ({ ...prev, phone: validateAddress(currentAddress).phone })); }} placeholder="+91 XXXXX XXXXX" style={touched.phone && formErrors.phone ? { borderColor: '#e03030' } : {}} />
                                    {touched.phone && formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Alternate Phone</label>
                                    <input type="tel" value={currentAddress.alternatePhone || ''} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, alternatePhone: val }); if (touched.alternatePhone) setFormErrors(prev => ({ ...prev, alternatePhone: validateAddress({ ...currentAddress, alternatePhone: val }).alternatePhone })); }} onBlur={() => { setTouched(prev => ({ ...prev, alternatePhone: true })); setFormErrors(prev => ({ ...prev, alternatePhone: validateAddress(currentAddress).alternatePhone })); }} placeholder="+91 XXXXX XXXXX (Optional)" style={touched.alternatePhone && formErrors.alternatePhone ? { borderColor: '#e03030' } : {}} />
                                    {touched.alternatePhone && formErrors.alternatePhone && <span className="field-error">{formErrors.alternatePhone}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Email ID</label>
                                    <input type="email" value={currentAddress.email} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, email: val }); if (touched.email) setFormErrors(prev => ({ ...prev, email: validateAddress({ ...currentAddress, email: val }).email })); }} onBlur={() => { setTouched(prev => ({ ...prev, email: true })); setFormErrors(prev => ({ ...prev, email: validateAddress(currentAddress).email })); }} placeholder="example@gmail.com" style={touched.email && formErrors.email ? { borderColor: '#e03030' } : {}} />
                                    {touched.email && formErrors.email && <span className="field-error">{formErrors.email}</span>}
                                </div>
                                <div className="form-group full-width">
                                    <label>Building / Area / Street</label>
                                    <input type="text" value={currentAddress.address1} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, address1: val }); if (touched.address1) setFormErrors(prev => ({ ...prev, address1: validateAddress({ ...currentAddress, address1: val }).address1 })); }} onBlur={() => { setTouched(prev => ({ ...prev, address1: true })); setFormErrors(prev => ({ ...prev, address1: validateAddress(currentAddress).address1 })); }} placeholder="Address line 1" style={touched.address1 && formErrors.address1 ? { borderColor: '#e03030' } : {}} />
                                    {touched.address1 && formErrors.address1 && <span className="field-error">{formErrors.address1}</span>}
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" value={currentAddress.city} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, city: val }); if (touched.city) setFormErrors(prev => ({ ...prev, city: validateAddress({ ...currentAddress, city: val }).city })); }} onBlur={() => { setTouched(prev => ({ ...prev, city: true })); setFormErrors(prev => ({ ...prev, city: validateAddress(currentAddress).city })); }} placeholder="e.g. Mumbai" style={touched.city && formErrors.city ? { borderColor: '#e03030' } : {}} />
                                    {touched.city && formErrors.city && <span className="field-error">{formErrors.city}</span>}
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" value={currentAddress.state} onChange={(e) => { const val = e.target.value; setCurrentAddress({ ...currentAddress, state: val }); if (touched.state) setFormErrors(prev => ({ ...prev, state: validateAddress({ ...currentAddress, state: val }).state })); }} onBlur={() => { setTouched(prev => ({ ...prev, state: true })); setFormErrors(prev => ({ ...prev, state: validateAddress(currentAddress).state })); }} placeholder="e.g. Maharashtra" style={touched.state && formErrors.state ? { borderColor: '#e03030' } : {}} />
                                    {touched.state && formErrors.state && <span className="field-error">{formErrors.state}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input type="text" value={currentAddress.pin} maxLength={6} onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 6); setCurrentAddress({ ...currentAddress, pin: val }); if (touched.pin) setFormErrors(prev => ({ ...prev, pin: validateAddress({ ...currentAddress, pin: val }).pin })); }} onBlur={() => { setTouched(prev => ({ ...prev, pin: true })); setFormErrors(prev => ({ ...prev, pin: validateAddress(currentAddress).pin })); }} placeholder="XXXXXX" style={touched.pin && formErrors.pin ? { borderColor: '#e03030' } : {}} />
                                    {touched.pin && formErrors.pin && <span className="field-error">{formErrors.pin}</span>}
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Address</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsAddressFormOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content checkout-modal">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={closeAll}></ion-icon>
                        <h2 className="modal-title">Order Summary</h2>

                        <div className="summary-list">
                            {isDirectBuy ? (
                                <>
                                    <div className="summary-row">
                                        <span className="label">Product</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span className="value">{directBuyProduct?.name}</span>
                                            {directBuyProduct?.stock > 0 && directBuyProduct?.stock <= 5 && (
                                                <span style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '2px', fontWeight: 500 }}>Only {directBuyProduct.stock} left in stock - order soon.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="summary-row">
                                        <span className="label">Size</span>
                                        <span className="value">{directBuyProduct?.size}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="label">Price</span>
                                        <span className="value">₹ {directBuyProduct?.price}.00</span>
                                    </div>
                                    {selectedGift && (
                                        <>
                                            <div className="summary-row">
                                                <span className="label">Gift Sample</span>
                                                <span className="value">{selectedGift}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span className="label">Gift Price</span>
                                                <span className="value" style={{ color: '#27ae60' }}>Free</span>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                cartItems.map(item => (
                                    <React.Fragment key={`${item.id}-${item.size}`}>
                                        <div className="summary-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <span className="label">{item.name} ({item.size}) x {item.quantity}</span>
                                                {item.stock > 0 && item.stock <= 5 && (
                                                    <span style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px', fontWeight: 500 }}>Only {item.stock} left in stock - order soon.</span>
                                                )}
                                            </div>
                                            <span className="value" style={{ marginTop: '2px' }}>₹ {(item.price * item.quantity).toLocaleString('en-IN')}.00</span>
                                        </div>
                                    </React.Fragment>
                                ))
                            )}
                        </div>

                        <div className="total-row">
                            <span>Total Amount</span>
                            <span className="total-price">₹ {isDirectBuy ? directBuyProduct?.price : getSubtotal().toLocaleString('en-IN')}.00</span>
                        </div>

                        <button className="buy-now-cta full-width-btn" onClick={handlePlaceOrder} disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            )}

            {/* Order Success Modal */}
            {isSuccessModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content success-modal">
                        <div className="success-animation">
                            <div className="checkmark-circle">
                                <div className="checkmark draw"></div>
                            </div>
                        </div>
                        <h2 className="modal-title">Your Order Is Placed!</h2>
                        <p className="order-id-text">Order ID: #{orderID}</p>
                        <button className="buy-now-cta full-width-btn" onClick={() => {
                            closeAll();
                            navigate('/');
                        }}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutFlow;
