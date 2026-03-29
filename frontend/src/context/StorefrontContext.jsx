import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

const StorefrontContext = createContext();

export const useStorefront = () => useContext(StorefrontContext);

export const StorefrontProvider = ({ children }) => {
    const defaultTopPhotos = [
        { id: 1, title: 'MISTIA', subtitle: 'An ethereal and captivating blend', imageUrl: 'media/mistia/1.png' },
        { id: 2, title: 'DOMINUS', subtitle: 'Commanding and powerful presence', imageUrl: 'media/dominus/1.png' },
        { id: 3, title: 'AQUA', subtitle: 'Fresh, vibrant, and deep oceanic notes', imageUrl: 'media/aqua/1.png' },
        { id: 4, title: 'MIDNIGHT', subtitle: 'A deep, mysterious evening experience', imageUrl: 'media/midnight/1.png' },
        { id: 5, title: 'DUSK', subtitle: 'Warm, woody notes for the bold', imageUrl: 'media/dusk/1.png' }
    ];

    const defaultCollections = {
        him: ['dominus', 'aqua', 'dusk'],
        her: ['mistia', 'midnight'],
        gift: ['gift1']
    };

    const defaultScentArt = [
        { id: 1, url: 'media/mistia/1.png' },
        { id: 2, url: 'media/midnight/1.png' },
        { id: 3, url: 'media/dusk/1.png' },
        { id: 4, url: 'media/dominus/1.png' },
        { id: 5, url: 'media/aqua/1.png' }
    ];

    const defaultReviews = [
        { id: 1, name: "Julian V.", text: "The most sophisticated scent I have ever worn. Truly a masterpiece of modern luxury.", rating: 5 },
        { id: 2, name: "Sophia L.", text: "Brilliant longevity and the sillage is perfect. I get compliments everywhere I go.", rating: 5 },
        { id: 3, name: "Marcus G.", text: "Fast shipping and the packaging is absolute luxury. A premium experience from start to finish.", rating: 5 },
        { id: 4, name: "Elena R.", text: "Unique, bold, and staying power that lasts all day. My new signature scent.", rating: 5 },
        { id: 5, name: "David K.", text: "The Art of Scent indeed. Brunati has redefined what a luxury fragrance should feel like.", rating: 5 }
    ];

    const defaultInfluencers = [
        { id: 1, name: "KATRINA KAIF", role: "INDIAN ACTRESS", wearing: "WEARING: ILLUMINATI", image: '' },
        { id: 2, name: "RAFTAAR", role: "MUSICIAN, HIP HOP", wearing: "WEARING: ILLUMINATI", image: '' },
        { id: 3, name: "PANTHER", role: "MUSICIAN, HIP HOP", wearing: "WEARING: UM VISION", image: '' },
        { id: 4, name: "SHANAYA KAPOOR", role: "INDIAN ACTRESS", wearing: "WEARING: NINJA NATION // 001", image: '' },
        { id: 5, name: "VICKY KAUSHAL", role: "INDIAN ACTOR", wearing: "WEARING: OUD WOOD", image: '' },
        { id: 6, name: "ALIA BHATT", role: "INDIAN ACTRESS", wearing: "WEARING: NIGHT BLOOM", image: '' }
    ];

    const defaultOrders = [
        { id: '#1004', customer: 'Arjun Mehta',    total: 1795, date: '25 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled', productId: 'dominus', stockDecremented: true },
        { id: '#1003', customer: 'Priya Sharma',   total: 3590, date: '25 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled', productId: 'mistia', stockDecremented: true },
        { id: '#1002', customer: 'Rahul Desai',    total: 1795, date: '24 Mar, 2026', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled', productId: 'aqua' },
        { id: '#1001', customer: 'Sneha Kulkarni', total: 7200, date: '24 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled', productId: 'midnight', stockDecremented: true },
        { id: '#1000', customer: 'Rohan Gupta',    total: 1795, date: '23 Mar, 2026', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled', productId: 'dusk' },
    ];

    const defaultInventory = [
        { id: 'dominus', name: 'Dominus Emperor',    price: 1795, stock: 24, image: 'media/dominus/1.png', status: 'Active' },
        { id: 'aqua', name: 'Brunati Aqua',       price: 1795, stock: 3,  image: 'media/aqua/1.png',    status: 'Active' },
        { id: 'mistia', name: 'Mestia',             price: 1795, stock: 32, image: 'media/mistia/1.png',  status: 'Draft' },
        { id: 'dusk', name: 'Citrine Dusk',       price: 1795, stock: 0,  image: 'media/dusk/1.png',    status: 'Archived' },
        { id: 'midnight', name: 'Midnight Glammer',   price: 1795, stock: 9,  image: 'media/midnight/1.png',status: 'Active' },
    ];

    const getInitialState = (key, defaultData) => {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : defaultData;
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryService.getAllCategories();
            if (res.status && res.data) {
                const names = res.data.map(c => c.name);
                setCategories(names.length > 0 ? names : ['Men', 'Women', 'Unisex']);
            }
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    }, []);

    const [topPhotos, setTopPhotos] = useState(() => getInitialState('sf_photos', defaultTopPhotos));
    const [categories, setCategories] = useState(() => getInitialState('sf_categories', ['Men', 'Women', 'Unisex']));
    const [collections, setCollections] = useState(() => getInitialState('sf_collections', defaultCollections));
    const [scentArt, setScentArt] = useState(() => getInitialState('sf_scent', defaultScentArt));
    const [reviews, setReviews] = useState(() => getInitialState('sf_reviews', defaultReviews));
    const [influencers, setInfluencers] = useState(() => getInitialState('sf_influencers', defaultInfluencers));
    const [inventoryProducts, setInventoryProducts] = useState(() => getInitialState('sf_inventory', defaultInventory));
    const [orders, setOrders] = useState(() => getInitialState('sf_orders', defaultOrders));

    useEffect(() => {
        const archivedIds = inventoryProducts.filter(p => p.status === 'Archived').map(p => p.id);
        let collectionsChanged = false;
        const newCollections = { ...collections };
        for (const cat in newCollections) {
            const originalLength = newCollections[cat].length;
            newCollections[cat] = newCollections[cat].filter(id => !archivedIds.includes(id));
            if (newCollections[cat].length !== originalLength) collectionsChanged = true;
        }
        if (collectionsChanged) setCollections(newCollections);
    }, [inventoryProducts]);

    useEffect(() => {
        let inventoryChanged = false;
        const newInventory = [...inventoryProducts];
        
        const newOrders = orders.map(o => {
            if ((o.paymentStatus === 'Paid' || o.fulfillmentStatus === 'Fulfilled') && !o.stockDecremented) {
                const pIndex = newInventory.findIndex(p => p.id === o.productId);
                if (pIndex !== -1 && newInventory[pIndex].stock > 0) {
                    newInventory[pIndex] = { ...newInventory[pIndex], stock: newInventory[pIndex].stock - 1 };
                    inventoryChanged = true;
                }
                return { ...o, stockDecremented: true };
            }
            return o;
        });

        newInventory.forEach((p, idx) => {
            if (p.stock === 0 && p.status !== 'Out of Stock' && p.status !== 'Archived') {
                newInventory[idx] = { ...p, status: 'Out of Stock' };
                inventoryChanged = true;
            }
        });

        if (inventoryChanged) {
            setInventoryProducts(newInventory);
        }
        
        if (JSON.stringify(newOrders) !== JSON.stringify(orders)) {
            setOrders(newOrders);
        }
    }, [orders, inventoryProducts]);

    useEffect(() => { localStorage.setItem('sf_photos', JSON.stringify(topPhotos)); }, [topPhotos]);
    useEffect(() => { localStorage.setItem('sf_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('sf_collections', JSON.stringify(collections)); }, [collections]);
    useEffect(() => { localStorage.setItem('sf_scent', JSON.stringify(scentArt)); }, [scentArt]);
    useEffect(() => { localStorage.setItem('sf_reviews', JSON.stringify(reviews)); }, [reviews]);
    useEffect(() => { localStorage.setItem('sf_influencers', JSON.stringify(influencers)); }, [influencers]);
    useEffect(() => { localStorage.setItem('sf_inventory', JSON.stringify(inventoryProducts)); }, [inventoryProducts]);
    useEffect(() => { localStorage.setItem('sf_orders', JSON.stringify(orders)); }, [orders]);

    return (
        <StorefrontContext.Provider value={{
            topPhotos, setTopPhotos,
            categories, setCategories,
            collections, setCollections,
            scentArt, setScentArt,
            reviews, setReviews,
            influencers, setInfluencers,
            inventoryProducts, setInventoryProducts,
            orders, setOrders,
            fetchCategories
        }}>
            {children}
        </StorefrontContext.Provider>
    );
};
