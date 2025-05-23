import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const goProductDetail = () => {
    navigate(`/product-detail/${product.product_id}`);
  };

  const avgRating = Number(product.avgRating) || 0;
  const totalReviews = product.totalReviews || 0;

  const formatCount = (count) => {
    if (count >= 1e6) return (count / 1e6).toFixed(1) + 'M';
    if (count >= 1e3) return (count / 1e3).toFixed(1) + 'k';
    return count.toString();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goProductDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goProductDetail();
      }}
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-300 outline-none focus:ring-2 focus:ring-blue-500"
    >
      <img
        className="p-4 rounded-t-lg w-full object-cover"
        src={
          product.ProductImages && product.ProductImages.length > 0
            ? product.ProductImages[0].image_url
            : 'http://cdn.pnj.io/images/thumbnails/485/485/detailed/47/sbxm00k000141-bong-tai-bac-pnjsilver.png'
        }
        alt={product.product_name || 'Product Image'}
        loading="lazy"
      />

      <div className="px-5 pb-5">
        <h2
          className="h-[45px] overflow-hidden text-center text-[16px] font-semibold text-gray-900 dark:text-white"
          title={product.product_name}
        >
          {product.product_name}
        </h2>

        <div className="flex items-center justify-center mt-2 mb-4 space-x-2">
          <div className="flex justify-center items-center">
            <ReactStars
              count={5}
              value={avgRating}
              size={20}
              isHalf={true}
              edit={false}
              activeColor="#ffd700"
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
            />
          </div>
          <div>
            <p className="text-gray-600 font-semibold leading-6">
              {formatCount(product?.positiveCount ?? 0)} khách hài lòng
            </p>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">({totalReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
