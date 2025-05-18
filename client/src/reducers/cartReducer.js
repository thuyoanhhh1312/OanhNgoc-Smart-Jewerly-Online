let initialState = [];

if (typeof window !== "undefined") {
  if (localStorage.getItem("cart")) {
    initialState = JSON.parse(localStorage.getItem("cart"));
  } else {
    initialState = [];
  }
}

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const itemToAdd = action.payload;
      const existItem = state.find(
        (item) => item.product_id === itemToAdd.product_id
      );

      if (existItem) {
        return state.map((item) =>
          item.product_id === itemToAdd.product_id
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      } else {
        return [...state, itemToAdd];
      }

    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.product_id === action.payload.product_id
          ? { ...item, count: action.payload.count }
          : item
      );

    default:
      return state;
  }
};
