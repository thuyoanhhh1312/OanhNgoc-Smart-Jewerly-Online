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
    case "ADD_TO_CART": {
      const itemToAdd = action.payload;
      const existItem = state.find(item => item.product_id === itemToAdd.product_id);

      if (existItem) {
        return state.map(item =>
          item.product_id === itemToAdd.product_id
            ? { ...item, count: (item.count || 0) + (itemToAdd.count || 1) }
            : item
        );
      } else {
        return [...state, { ...itemToAdd, count: itemToAdd.count || 1 }];
      }
    }

    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.product_id === action.payload.product_id
          ? { ...item, count: action.payload.count }
          : item
      );

    case "UPDATE_CART":
      return action.payload;

    default:
      return state;
  }
};
