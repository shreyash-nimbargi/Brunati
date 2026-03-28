import React from 'react';
import { useStorefront } from '../../context/StorefrontContext';

const Testimonials = () => {
    const { reviews: rawReviews } = useStorefront();
    const reviews = rawReviews && rawReviews.length > 0 ? rawReviews : [];

    return (
        <section className="reviews-section" style={{ padding: '80px 0', backgroundColor: 'var(--apple-off-white)' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h2 className="section-title">Client Experiences</h2>
            </div>
            <div className="reviews-carousel" style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '0 20px 30px' }}>
                {reviews.map((review, idx) => (
                    <div key={idx} className="review-card" style={{ flex: '0 0 300px', padding: '30px', background: '#fff', borderRadius: '16px', border: '1px solid var(--apple-border)' }}>
                        <div className="stars" style={{ color: 'var(--star-yellow)', marginBottom: '12px' }}>★★★★★</div>
                        <p className="review-text" style={{ fontStyle: 'italic', marginBottom: '15px' }}>"{review.text}"</p>
                        <div className="review-author" style={{ borderTop: '1px solid var(--apple-border)', paddingTop: '12px', marginTop: 'auto' }}>
                            {review.name}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
