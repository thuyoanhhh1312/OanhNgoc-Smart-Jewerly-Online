import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../layout/MainLayout";
import CartCard from "../components/CartCard";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [selectAll, setSelectAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const updatedCart = cart.map((item) => ({
      ...item,
      selected: checked,
    }));

    dispatch({
      type: "UPDATE_CART",
      payload: updatedCart,
    });
  };

  // Xử lý chọn từng item
  const handleSelectItem = (productId, checked) => {
    const updatedCart = cart.map((item) =>
      item.product_id === productId ? { ...item, selected: checked } : item
    );

    dispatch({
      type: "UPDATE_CART",
      payload: updatedCart,
    });
  };

  const handleQuantityChange = (productId, newCount) => {
    const updatedCart = cart.map((item) =>
      item.product_id === productId ? { ...item, count: newCount } : item
    );

    dispatch({
      type: "UPDATE_CART",
      payload: updatedCart,
    });
  };

  useEffect(() => {
    if (cart.length === 0) {
      setSelectAll(false);
      setTotalPrice(0);
    } else {
      const allSelected = cart.every((item) => item.selected);
      setSelectAll(allSelected);

      const total = cart.reduce((acc, item) => {
        if (item.selected) {
          const count = item.count ?? 1;
          return acc + item.price * count;
        }
        return acc;
      }, 0);
      setTotalPrice(total);
    }
  }, [cart]);

  return (
    <MainLayout>
      <div className="w-full flex justify-center bg-[#F1F0F1] min-h-[calc(100vh)] text-[14px]">
        <div className="m-auto bg-white w-[800px] sm:my-[50px] my-0 p-3 rounded-lg">
          <div className="text-[#003468] flex items-center cursor-pointer">
            <img
              alt="previous"
              loading="lazy"
              width="20"
              height="20"
              decoding="async"
              src="https://www.pnj.com.vn/site/assets/images/previous.svg"
              className="w-[20px] h-[20px] mr-2"
            />
            <span className="text-[16px] font-bold">Quay lại</span>
          </div>
          <div className="text-center text-[#272727] font-bold mb-[15px]">
            Giỏ hàng của bạn
          </div>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-[20%]">
              <img
                alt="empty-cart"
                loading="lazy"
                width="278px"
                height="200px"
                decoding="async"
                src="https://cdn.pnj.io/images/2023/relayout-pdp/empty_product_line.png?1702525998347"
                // className="w-[100px] h-[100px] m-auto mb-[10px]"
              />
              <p className="my-[10px]">Giỏ hàng trống</p>
            </div>
          ) : (
            <div>
              <div>
                <div className="flex justify-between items-center my-[10px]">
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="all-in-pnj"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      <label
                        htmlFor="all-in-pnj"
                        className="text-[14px] font-bold"
                      >
                        Tất cả sản phẩm
                      </label>
                    </div>
                  </div>
                  {/* Nút xóa có thể xử lý sau */}
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
              </div>
              <div>
                {cart?.map((item, index) => {
                  return (
                    <CartCard
                      key={item.product_id}
                      item={item}
                      onSelectItem={handleSelectItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  );
                })}
              </div>
              {/* Tổng tiền, thanh toán ... */}
              <div className="flex justify-between">
                <span>Tổng tiền</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <div className="w-full rounded-lg text-center  py-[5px] font-bold bg-[#003468] text-white cursor-pointer">
                Tiếp tục
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
