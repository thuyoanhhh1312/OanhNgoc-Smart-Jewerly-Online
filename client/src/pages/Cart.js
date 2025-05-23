// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom"; // nếu dùng react-router
// import MainLayout from "../layout/MainLayout";
// import CartCard from "../components/CartCard";

// const Cart = () => {
//   const cart = useSelector((state) => state.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [selectAll, setSelectAll] = useState(false);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     if (cart.length === 0) {
//       setSelectAll(false);
//       setTotalPrice(0);
//       return;
//     }
//     const allSelected = cart.every((item) => item.selected);
//     setSelectAll(allSelected);

//     const total = cart.reduce((acc, item) => {
//       if (item.selected) {
//         const count = item.count ?? 1;
//         return acc + item.price * count;
//       }
//       return acc;
//     }, 0);
//     setTotalPrice(total);
//   }, [cart]);

//   const handleSelectAll = useCallback(
//     (e) => {
//       const checked = e.target.checked;
//       setSelectAll(checked);

//       const updatedCart = cart.map((item) => ({
//         ...item,
//         selected: checked,
//       }));

//       dispatch({ type: "UPDATE_CART", payload: updatedCart });
//     },
//     [cart, dispatch]
//   );

//   const handleSelectItem = useCallback(
//     (productId, checked) => {
//       const updatedCart = cart.map((item) =>
//         item.product_id === productId ? { ...item, selected: checked } : item
//       );

//       dispatch({ type: "UPDATE_CART", payload: updatedCart });
//     },
//     [cart, dispatch]
//   );

//   const handleQuantityChange = useCallback(
//     (productId, newCount) => {
//       if (newCount < 1) return;

//       const updatedCart = cart.map((item) =>
//         item.product_id === productId ? { ...item, count: newCount } : item
//       );

//       dispatch({ type: "UPDATE_CART", payload: updatedCart });
//     },
//     [cart, dispatch]
//   );

//   const handleDeleteItem = useCallback(
//     (productId) => {
//       const updatedCart = cart.filter((item) => item.product_id !== productId);
//       dispatch({ type: "UPDATE_CART", payload: updatedCart });
//     },
//     [cart, dispatch]
//   );

//   // Handler quay lại trang trước
//   const handleGoBack = () => {
//     // Nếu dùng react-router:
//     if (navigate) {
//       navigate(-1);
//     } else {
//       // Fallback nếu không dùng react-router
//       window.history.back();
//     }
//   };

//   return (
//     <MainLayout>
//       <div className="w-full flex justify-center bg-[#F1F0F1] min-h-[calc(100vh)] text-[14px]">
//         <div className="m-auto bg-white w-[800px] sm:my-[50px] my-0 p-3 rounded-lg">
//           {/* Nút Quay lại */}
//           <div
//             className="text-[#003468] flex items-center cursor-pointer mb-4 hover:text-[#001d3d] select-none"
//             onClick={handleGoBack}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") {
//                 handleGoBack();
//               }
//             }}
//             aria-label="Quay lại trang trước"
//           >
//             <img
//               alt="previous"
//               loading="lazy"
//               width="20"
//               height="20"
//               decoding="async"
//               src="https://www.pnj.com.vn/site/assets/images/previous.svg"
//               className="w-[20px] h-[20px] mr-2"
//             />
//             <span className="text-[16px] font-bold select-none">Quay lại</span>
//           </div>

//           <h2 className="text-center text-[#272727] font-bold mb-[15px] text-xl">
//             Giỏ hàng của bạn
//           </h2>

//           {cart.length === 0 ? (
//             <div className="flex flex-col items-center justify-center my-[20%]">
//               <img
//                 alt="empty-cart"
//                 loading="lazy"
//                 width="278px"
//                 height="200px"
//                 decoding="async"
//                 src="https://cdn.pnj.io/images/2023/relayout-pdp/empty_product_line.png?1702525998347"
//               />
//               <p className="my-[10px]">Giỏ hàng trống</p>
//             </div>
//           ) : (
//             <>
//               <div className="flex justify-between items-center my-[10px]">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="select-all"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                   />
//                   <label
//                     htmlFor="select-all"
//                     className="text-[14px] font-bold cursor-pointer"
//                   >
//                     Tất cả sản phẩm
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 {cart.map((item) => (
//                   <CartCard
//                     key={item.product_id}
//                     item={item}
//                     onSelectItem={handleSelectItem}
//                     onQuantityChange={handleQuantityChange}
//                     onDeleteItem={handleDeleteItem}
//                   />
//                 ))}
//               </div>

//               <div className="flex justify-between items-center mt-6 text-lg font-semibold">
//                 <span>Tổng tiền:</span>
//                 <span>
//                   {new Intl.NumberFormat("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   }).format(totalPrice)}
//                 </span>
//               </div>

//               <button
//                 className="w-full mt-4 rounded-lg py-3 font-bold bg-[#003468] text-white hover:bg-[#00254f] transition"
//                 onClick={() =>
//                   alert("Chức năng thanh toán chưa được triển khai")
//                 }
//               >
//                 Tiếp tục
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default Cart;
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import MainLayout from "../layout/MainLayout";
import CartCard from "../components/CartCard";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectAll, setSelectAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) {
      setSelectAll(false);
      setTotalPrice(0);
      return;
    }
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
  }, [cart]);

  const handleSelectAll = useCallback(
    (e) => {
      const checked = e.target.checked;
      setSelectAll(checked);

      const updatedCart = cart.map((item) => ({
        ...item,
        selected: checked,
      }));

      dispatch({ type: "UPDATE_CART", payload: updatedCart });
    },
    [cart, dispatch]
  );

  const handleSelectItem = useCallback(
    (productId, checked) => {
      const updatedCart = cart.map((item) =>
        item.product_id === productId ? { ...item, selected: checked } : item
      );

      dispatch({ type: "UPDATE_CART", payload: updatedCart });
    },
    [cart, dispatch]
  );

  const handleQuantityChange = useCallback(
    (productId, newCount) => {
      if (newCount < 1) return;

      const updatedCart = cart.map((item) =>
        item.product_id === productId ? { ...item, count: newCount } : item
      );

      dispatch({ type: "UPDATE_CART", payload: updatedCart });
    },
    [cart, dispatch]
  );

  const handleDeleteItem = useCallback(
    (productId) => {
      const updatedCart = cart.filter((item) => item.product_id !== productId);
      dispatch({ type: "UPDATE_CART", payload: updatedCart });
    },
    [cart, dispatch]
  );

  // Handler quay lại trang trước
  const handleGoBack = () => {
    if (navigate) {
      navigate(-1);
    } else {
      window.history.back();
    }
  };

  // Khi bấm nút Tiếp tục: chuyển sang trang OrderPage, truyền totalPrice qua state
  const handleContinue = () => {
  const selectedItems = cart.filter(item => item.selected);
  if (selectedItems.length === 0) {
    alert("Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng");
    return;
  }

  const total = selectedItems.reduce((acc, item) => acc + item.price * (item.count ?? 1), 0);

  navigate("/checkout", {
    state: {
      selectedItems,
      totalAmount: total
    }
  });
};


  return (
    <MainLayout>
      <div className="w-full flex justify-center bg-[#F1F0F1] min-h-[calc(100vh)] text-[14px]">
        <div className="m-auto bg-white w-[800px] sm:my-[50px] my-0 p-3 rounded-lg">
          {/* Nút Quay lại */}
          <div
            className="text-[#003468] flex items-center cursor-pointer mb-4 hover:text-[#001d3d] select-none"
            onClick={handleGoBack}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleGoBack();
              }
            }}
            aria-label="Quay lại trang trước"
          >
            <img
              alt="previous"
              loading="lazy"
              width="20"
              height="20"
              decoding="async"
              src="https://www.pnj.com.vn/site/assets/images/previous.svg"
              className="w-[20px] h-[20px] mr-2"
            />
            <span className="text-[16px] font-bold select-none">Quay lại</span>
          </div>

          <h2 className="text-center text-[#272727] font-bold mb-[15px] text-xl">
            Giỏ hàng của bạn
          </h2>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-[20%]">
              <img
                alt="empty-cart"
                loading="lazy"
                width="278px"
                height="200px"
                decoding="async"
                src="https://cdn.pnj.io/images/2023/relayout-pdp/empty_product_line.png?1702525998347"
              />
              <p className="my-[10px]">Giỏ hàng trống</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center my-[10px]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-[14px] font-bold cursor-pointer"
                  >
                    Tất cả sản phẩm
                  </label>
                </div>
              </div>

              <div>
                {cart.map((item) => (
                  <CartCard
                    key={item.product_id}
                    item={item}
                    onSelectItem={handleSelectItem}
                    onQuantityChange={handleQuantityChange}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center mt-6 text-lg font-semibold">
                <span>Tổng tiền:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>

              <button
                className="w-full mt-4 rounded-lg py-3 font-bold bg-[#003468] text-white hover:bg-[#00254f] transition"
                onClick={handleContinue}
              >
                Tiếp tục
              </button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
