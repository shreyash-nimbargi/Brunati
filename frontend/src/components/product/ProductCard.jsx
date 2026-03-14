import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, meta, price, img1, img2 }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
            <div className="img-container">
                <img src={img1} className="prod-img-primary" alt={name} />
                <img src={img2} className="prod-img-secondary" alt={`${name} Hover`} />
            </div>
            <div className="prod-text">
                <h3 className="prod-name">{name}</h3>
                <div className="prod-meta">{meta}</div>
                <div className="prod-price">{price}</div>
            </div>
            <div className="card-actions">
                <button className="btn-check">Explore</button>
                <button className="btn-cart" onClick={(e) => {
                    e.stopPropagation();
                    console.log('Added to cart:', name);
                }}>
                    <ion-icon name="bag-handle-outline"></ion-icon>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
