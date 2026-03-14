import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, meta, price, img1, img2, accords, description }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
            <div className="wishlist-overlay">
                <ion-icon name="heart-outline"></ion-icon>
            </div>
            
            <div className="img-container">
                <img src={img1} className="prod-img-primary" alt={name} />
                <img src={img2} className="prod-img-secondary" alt={`${name} Hover`} />
            </div>

            <div className="prod-text">
                <div className="prod-header-row">
                    <div className="name-and-type">
                        <h3 className="prod-name">{name}</h3>
                        <div className="prod-meta">{meta.split('•')[1] || meta}</div>
                    </div>
                    <div className="prod-rating-box">
                        <div className="stars">
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                        </div>
                        <span className="reviews-label">16 Reviews</span>
                    </div>
                </div>

                <div className="prod-accords-row">
                    {accords?.slice(0, 3).join(' | ')}
                </div>

                <div className="prod-sizes-row">
                    <span className="size-label">Size:</span> 30ml 50ml 100ml 20ml
                </div>

                <hr className="card-divider" />

                <p className="prod-description-mini">
                    {description?.substring(0, 120)}...
                </p>

                <button className="add-to-bag-btn" onClick={(e) => {
                    e.stopPropagation();
                    console.log('Added to bag:', name);
                }}>
                    Add to bag - MRP: {price}
                </button>
                <p className="complimentary-gift-text">
                    Complimentary Gift on orders above ₹149...
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
