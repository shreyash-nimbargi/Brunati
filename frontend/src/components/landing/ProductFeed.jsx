import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductFeed = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const products = [
        {
            id: 1,
            name: "Dominus Emperor",
            meta: "100ml • Extrait De Parfum",
            price: "₹ 1795.00",
            description: "A commanding presence. Sicilian Bergamot and Pink Pepper open the gates to a heart of rich Patchouli and exotic spices.",
            image: "/media/dominus/1.png"
        },
        {
            id: 2,
            name: "Brunati Aqua",
            meta: "100ml • Extrait De Parfum",
            price: "₹ 1795.00",
            description: "The spirit of the Mediterranean. A surge of mineral freshness combined with Sea Salt and Atlas Cedarwood.",
            image: "/media/aqua/1.png"
        },
        {
            id: 3,
            name: "Mestia",
            meta: "100ml • Extrait De Parfum",
            price: "₹ 1795.00",
            description: "Ethereal and timeless. A delicate dance of Rose De Grasse and Jasmine, anchored by the subtle depth of White Musk.",
            image: "/media/mistia/1.png"
        },
        {
            id: 4,
            name: "Citrine Dusk",
            meta: "100ml • Extrait De Parfum",
            price: "₹ 1795.00",
            description: "The warmth of a golden sunset. A sophisticated blend of citrus zest, amber, and warm woody base notes.",
            image: "/media/dusk/1.png"
        },
        {
            id: 5,
            name: "Midnight Glammer",
            meta: "100ml • Extrait De Parfum",
            price: "₹ 1795.00",
            description: "Provocative and deep. Dark Cherry and Tonka Bean meet a base of smoky Vetiver for a mysterious allure.",
            image: "/media/midnight/1.png"
        },
        {
            id: 6,
            name: "The Discovery Kit",
            meta: "5 x 10ml • Premium Set",
            price: "₹ 499.00",
            description: "Experience the complete collection. 5 iconic scents in travel-ready vials for the ultimate olfactory journey.",
            image: "https://images.unsplash.com/photo-154939602-43ebca2327af?w=600"
        }
    ];

    return (
        <section className="vertical-feed">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Our Fragrances</h2>
            {products.map((product) => (
                <div key={product.id} className="detailed-product-card">
                    <div className="card-image-wrap">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="card-details">
                        <span className="card-meta">{product.meta}</span>
                        <h3>{product.name}</h3>
                        <p className="card-price">{product.price}</p>
                        <p className="card-desc">{product.description}</p>
                        <div className="card-actions">
                            <button 
                                className="btn-detail btn-primary-dark"
                                onClick={() => {
                                    addToCart({
                                        id: String(product.id),
                                        name: product.name,
                                        size: '100ml',
                                        price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
                                        quantity: 1,
                                        image: product.image,
                                    });
                                    navigate('/cart');
                                }}
                            >Add to Cart</button>
                            <button className="btn-detail" style={{ border: '1px solid #1d1d1f' }}>View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default ProductFeed;
