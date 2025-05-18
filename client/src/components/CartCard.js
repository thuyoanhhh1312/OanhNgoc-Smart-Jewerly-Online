import React from "react";
import CountWithControls from "./CountWithControls";

const CartCard = ({ item, onSelectItem, onQuantityChange }) => {
  const handleIncrease = () => {
    onQuantityChange(item.product_id, item.count + 1);
  };

  const handleDecrease = () => {
    if (item.count > 1) {
      onQuantityChange(item.product_id, item.count - 1);
    }
  };
  return (
    <div className="flex justify-between items-center my-[10px]">
      <div className="flex justify-center items-center gap-2">
        <input
          type="checkbox"
          id={item.product_id}
          checked={!!item.selected} // chắc chắn là boolean
          onChange={(e) => onSelectItem(item.product_id, e.target.checked)}
        />
        <label
          htmlFor={item.product_id}
          className="ml-1 text-[#003468] leading-[24.5px] cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <img
              src={
                item.ProductImages && item.ProductImages.length > 0
                  ? item.ProductImages[0].image_url
                  : ""
              }
              alt={item.product_name}
              className="w-[80px] h-[80px] object-cover"
            />
            <div className="flex flex-col ml-2">
              <p className="text-[#003468]">{item.product_name}</p>
              {/* <CountWithControls
                quantity={item.count}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
              /> */}
              <p className="font-bold text-[#C58C46] my-[5px]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
            </div>
          </div>
        </label>
      </div>
      {/* Nút xóa, xử lý riêng */}
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        icon="trash"
        className="svg-inline--fa fa-trash text-[18px] w-[18px] h-[18px] hover:text-red-500 cursor-pointer"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
        ></path>
      </svg>
    </div>
  );
};

export default CartCard;
