import React from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const ProductCard = React.memo(({ product, isDealCard = false }) => {
  const {
    addItem,
    toggleWishlist,
    isInWishlist,
    openQuickView
  } = useCart();

  const isWish = isInWishlist(product.id);

  return (
    <div className="product-card" data-product-id={product.id}>
      <div className="card-top-bar">
        <div className="card-badges-stack">
          {product.badge && (
            <span
              className={`badge-tag ${
                product.isBestSeller ? 'badge-best' : product.isDeal ? 'badge-deal' : 'badge-spec'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="badge-tag badge-deal">{product.discount}</span>
          )}
        </div>
        <div className="card-quick-actions">
          <button
            className={`card-action-btn btn-wishlist-toggle ${isWish ? 'active-wishlist' : ''}`}
            title="Save to Wishlist"
            aria-label={`Save ${product.name} to wishlist`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isWish ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="product-image-box" onClick={() => openQuickView(product)}>
        <ProductImage type={product.image} className="product-svg-img" />
        <button className="quick-view-overlay-btn" aria-label={`Quick view ${product.name}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Quick View
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category-text">{product.categoryLabel}</div>
        <h4
          className="product-card-title"
          onClick={() => openQuickView(product)}
          title={product.name}
        >
          {product.name}
        </h4>

        <div className="product-card-rating">
          <span className="stars-row" aria-label={`Rated ${product.rating} out of 5 stars`}>★★★★★</span>
          <span className="review-count">
            ({product.rating} • {product.reviewsCount} reviews)
          </span>
        </div>

        <div className="product-sku-tag mono">SKU: {product.sku}</div>

        <div className="product-card-footer">
          <div className="price-container">
            <div className="current-price">₹{product.price.toLocaleString('en-IN')}</div>
            <div className="price-details">
              <span className="strike-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span className="discount-pill">{product.discount}</span>
            </div>
          </div>
          <button
            className="btn-add-cart btn-add-item-to-cart"
            title="Add to Cart"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              addItem(product.id, 1);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
