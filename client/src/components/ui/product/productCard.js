import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goProductDetail = () => {
    navigate(`/${product.slug}`);
  };

  const avgRating = Number(product.avgRating) || 0;
  const totalReviews = product.totalReviews || 0;

  const formatCount = (count) => {
    if (count >= 1e6) return (count / 1e6).toFixed(1) + 'M';
    if (count >= 1e3) return (count / 1e3).toFixed(1) + 'k';
    return count.toString();
  };

  const handleAddToCart = (e, count = 1) => {
    e.stopPropagation();

    const updatedItem = { ...product, count };
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existIndex = cart.findIndex((item) => item.product_id === product.product_id);
    if (existIndex >= 0) {
      cart[existIndex].count += count;
    } else {
      cart.push(updatedItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    dispatch({ type: 'ADD_TO_CART', payload: updatedItem });
    toast.success('Đã thêm vào giỏ hàng thành công!');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goProductDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goProductDetail();
      }}
      className="
        w-full max-w-sm
        bg-white border border-gray-200 rounded-lg shadow-sm
        dark:bg-gray-800 dark:border-gray-700
        cursor-pointer hover:shadow-lg transition-shadow duration-300
        outline-none focus:ring-2 focus:ring-blue-500
        flex flex-col
      "
    >
      <img
        className="p-4 rounded-t-lg w-full object-cover h-48 sm:h-56 md:h-64"
        src={
          product.ProductImages && product.ProductImages.length > 0
            ? product.ProductImages[0].image_url
            : 'http://cdn.pnj.io/images/thumbnails/485/485/detailed/47/sbxm00k000141-bong-tai-bac-pnjsilver.png'
        }
        alt={product.product_name || 'Product Image'}
        loading="lazy"
      />

      <div className="px-5 pb-5 flex flex-col flex-grow">
        <h2
          className="
            h-[50px] overflow-hidden
            text-center
            text-sm sm:text-base md:text-lg
            font-semibold
            text-gray-900 dark:text-white
          "
          title={product.product_name}
        >
          {product.product_name}
        </h2>

        <div className="flex flex-wrap justify-center items-center mt-2 mb-4 space-x-2 space-y-1 sm:space-y-0">
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
            <p className="text-gray-600 font-semibold leading-6 text-xs sm:text-sm">
              {formatCount(product?.positiveCount ?? 0)} khách hài lòng
            </p>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">({totalReviews})</span>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 mb-0 sm:mb-4 mt-auto min-w-0"
        >
          <span
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-0"
            title={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </span>

          <button
            onClick={(e) => handleAddToCart(e, 1)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-full sm:max-w-[140px] md:max-w-[160px] break-words text-center"
            type="button"
            aria-label={`Thêm ${product.product_name} vào giỏ hàng`}
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;