import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import { useParams } from 'react-router-dom';
import productApi from '../api/productApi';
import DOMPurify from "dompurify";
import axios from 'axios';
import { ShippingIcon } from '../assets';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const handleGetProduct = async () => {
        try {
            const res = await productApi.getProductById(id);
            setProduct(res);
            console.log("Product details:", res);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    useEffect(() => {
        handleGetProduct();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <MainLayout>
            <div className="product-detail-container py-10">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Hình ảnh sản phẩm */}
                        <div className="product-images">
                            <div className="mb-4">
                                <img
                                    src={product.ProductImages.length > 0 ? product.ProductImages[0].image_url : "http://cdn.pnj.io/images/thumbnails/485/485/detailed/47/sbxm00k000141-bong-tai-bac-pnjsilver.png"}
                                    alt={product.product_name}
                                    className="w-full rounded-lg shadow-md"
                                />
                            </div>
                            {/* Thêm các hình ảnh khác nếu có */}
                            <div className="flex gap-4">
                                {product.ProductImages.map((image) => (
                                    <img
                                        key={image.image_id}
                                        src={image.image_url}
                                        alt={image.alt_text}
                                        className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="product-info">
                            <h1 className="text-3xl font-semibold mb-4">{product.product_name}</h1>

                            <div className="price mb-4">
                                <p className="text-xl font-bold">
                                    Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </p>
                            </div>
                            <div className="quantity mb-4">
                                <p>Số lượng còn lại: {product.quantity}</p>
                            </div>
                            <div className="category-info mb-6">
                                <p><strong>Danh mục:</strong> {product.Category.category_name}</p>
                                <p><strong>Danh mục con:</strong> {product.SubCategory.subcategory_name}</p>
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                        <div className="mb-6">
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }} />
                        </div>
                        <div>
                            <img src={ShippingIcon} alt="shipping-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductDetail;
