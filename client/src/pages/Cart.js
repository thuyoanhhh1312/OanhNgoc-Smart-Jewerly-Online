import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../layout/MainLayout";

const Cart = () => {
    const { cart, user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();
    console.log("cart", cart);


    return (
        <MainLayout>
            Card
        </MainLayout>
    )
}

export default Cart;