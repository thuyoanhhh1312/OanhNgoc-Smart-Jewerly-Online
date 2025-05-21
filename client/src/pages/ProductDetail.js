import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import { useParams, Link } from 'react-router-dom';
import productApi from '../api/productApi';
import DOMPurify from "dompurify";
import { ShippingIcon, Shopping247, ThuDoi } from '../assets';
import ViewedProducts from "../components/ViewedProducts";
import _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import ReviewModal from '../components/ReviewMoal';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from "react-rating-stars-component";
import RatingSummary from '../components/RatingSummary';
import dayjs from 'dayjs';
import ReviewTabs from '../components/ReviewTabs';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [isPolicyVisible, setIsPolicyVisible] = useState(false);
    const [isFAQVisible, setIsFAQVisible] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState(null);
    console.log("reviewSummary", reviewSummary)

    const toggleDescription = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
        setIsPolicyVisible(false);
        setIsFAQVisible(false);
    }

    const togglePolicy = () => {
        setIsPolicyVisible(!isPolicyVisible);
        setIsDescriptionVisible(false);
        setIsFAQVisible(false);
    }

    const toggleFAQ = () => {
        setIsFAQVisible(!isFAQVisible);
        setIsDescriptionVisible(false);
        setIsPolicyVisible(false);
    }

    const handleGetProduct = async () => {
        try {
            const res = await productApi.getProductById(id);
            setProduct(res);

            const similarRes = await productApi.getSimilarProducts(res.category_id, res.subcategory_id);
            setSimilarProducts(similarRes);
            console.log("Chi tiết sản phẩm:", res);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
    };

    const handleAddToCart = () => {
        if (typeof window === "undefined") return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existIndex = cart.findIndex(item => item.product_id === product.product_id);

        if (existIndex >= 0) {
            cart[existIndex].count = (cart[existIndex].count || 1) + 1;
        } else {
            cart.push({ ...product, count: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        dispatch({
            type: "ADD_TO_CART",
            payload: { ...product, count: 1 },
        });
    };


    const handleSubmitReview = async (review) => {
        try {
            await productApi.addProductReview(product?.product_id, { customer_id: user.id, ...review }, user?.token);
            toast.success("Đánh giá đã gửi thành công!");
            setIsReviewModalOpen(false);
            loadReviews();
            getRatingSummary();
        } catch (error) {
            toast.error('Gửi đánh giá thất bại');
        }
    };

    const loadReviews = async () => {
        try {
            const data = await productApi.getProductReviews(product?.product_id);
            setReviews(data?.reviews);
        } catch (error) {
            console.error(error);
        }
    };

    const getRatingSummary = async () => {
        try {
            const res = await productApi.getProductReviewSummary(product?.product_id);;
            setReviewSummary(res?.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const viewed = JSON.parse(localStorage.getItem("viewedProducts") || "[]");

        const filtered = viewed.filter(p => p.product_id !== product.product_id);

        filtered.unshift({
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.price,
            image_url: product.ProductImages?.[0]?.image_url || "",
        });

        // Giới hạn 10 sản phẩm
        if (filtered.length > 10) filtered.pop();

        localStorage.setItem("viewedProducts", JSON.stringify(filtered));
    }, [product]);

    useEffect(() => {
        loadReviews();
        getRatingSummary();
    }, [product?.product_id]);


    if (!product) return <div>Đang tải...</div>;

    return (
        <MainLayout>
            <div className="product-detail-container py-10">
                <ToastContainer />
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Khu vực Hình ảnh sản phẩm */}
                        <div className="product-images">
                            <div className="mb-4">
                                <img
                                    src={product.ProductImages.length > 0 ? product.ProductImages[0].image_url : "http://cdn.pnj.io/images/thumbnails/485/485/detailed/47/sbxm00k000141-bong-tai-bac-pnjsilver.png"}
                                    alt={product.product_name}
                                    className="w-full rounded-lg shadow-md"
                                />
                            </div>
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

                        {/* Khu vực Thông tin sản phẩm */}
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

                            {/* Các biểu tượng vận chuyển */}
                            <div className="flex  mt-[10px]   items-center bg-[#f2f2f2] sm:px-[10px] px-[5px] py-[5px] rounded-md justify-between">
                                <div className="flex gap-1 items-center sm:text-[13px] text-[9px] ">
                                    <img alt="24/7 service" loading="lazy" width="25px" height="25px" decoding="async" data-nimg="1" className="w-4 h-4" src={ShippingIcon} />
                                    <p className="text-[#202E65] font-bold">Miễn phí giao hàng​</p>
                                </div>
                                <div className="flex gap-1 items-center sm:text-[13px] text-[9px] ">
                                    <img alt="24/7 service" loading="lazy" width="25px" height="25px" decoding="async" data-nimg="1" className="w-4 h-4" src={Shopping247} />
                                    <p className="text-[#202E65] font-bold">Phục vụ 24/7​</p>
                                </div>
                                <div className="flex gap-1 items-center sm:text-[13px] text-[9px] ">
                                    <img alt="24/7 service" loading="lazy" width="25px" height="25px" decoding="async" data-nimg="1" className="w-4 h-4" src={ThuDoi} />
                                    <p className="text-[#202E65] font-bold">Thu đổi 48h​</p>
                                </div>
                            </div>

                            {/* Các nút hành động */}
                            <div className="flex items-center ">
                                <button className="w-full   bg-[#ad2a36] flex flex-1 justify-center items-center flex-col font-bold text-white h-[40px] rounded-lg mt-[10px] ">
                                    <span className="text-[16px]">Mua ngay</span>
                                    <span className="text-[12px]">(Giao hàng miễn phí tận nhà hoặc nhận tại cửa hàng)</span>
                                </button>
                            </div>
                            <div className="flex justify-center items-center gap-2 my-[10px]">
                                <div className='flex items-center  space-x-4 flex-1'>
                                    <button onClick={handleAddToCart} className='class="w-full   bg-[#fffff] border border-[#202E65]  flex flex-1 justify-center items-center flex-col font-bold text-white h-[40px] rounded-lg "'>
                                        <span className=" text-[13px] text-[#202E65]">Thêm vào giỏ hàng</span>
                                    </button>
                                </div>
                                <div className='flex gap-5 flex-1'>
                                    <a href="#" className="flex-1 w-full md:w-6/12 xl:w-full bg-[#202e65] h-[40px] text-white font-bold rounded-lg flex flex-col items-center justify-center ">
                                        <span className="text-[16px]">Gọi ngay (miễn phí)</span>
                                        <span className="text-[12px]">((Nhận ngay ưu đãi))</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class>
                            <div className="lg:block bg-white">
                                <div className="bg-white sticky top-[49px] mb-[10px] z-10">
                                    <div className="mx-auto max-w-[1100px] px-[10px] md:px-4 2xl:px-0">
                                        <div className="flex justify-between items-center my-[10px]">
                                            <h2
                                                className={`sm:text-[14px] text-[13px] text-center py-[10px] cursor-pointer px-2 rounded-sm ${isPolicyVisible ? "bg-[#202e65] text-white border-b-2 border-[#ad2a36]" : ""
                                                    }`}
                                                onClick={togglePolicy}
                                            >
                                                Chính sách hậu mãi
                                            </h2>
                                            <h2
                                                className={`sm:text-[14px] text-[13px] text-center py-[10px] cursor-pointer px-2 rounded-sm ${isDescriptionVisible ? "bg-[#202e65] text-white border-b-2 border-[#ad2a36]" : ""
                                                    }`}
                                                onClick={toggleDescription}
                                            >
                                                Mô tả sản phẩm
                                            </h2>
                                            <h2
                                                className={`sm:text-[14px] text-[13px] text-center py-[10px] cursor-pointer px-2 rounded-sm ${isFAQVisible ? "bg-[#202e65] text-white border-b-2 border-[#ad2a36]" : ""
                                                    }`}
                                                onClick={toggleFAQ}
                                            >
                                                Câu hỏi thường gặp
                                            </h2>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Hiển thị mô tả sản phẩm */}
                            {isDescriptionVisible && (
                                <div className="mx-auto max-w-[1100px] px-[10px] md:px-4 2xl:px-0">
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }} />
                                </div>
                            )}

                            {/* Hiển thị chính sách hậu mãi */}
                            {isPolicyVisible && (
                                <div className="mx-auto max-w-[1100px] px-[10px] md:px-4 2xl:px-0">
                                    <div className="policy-content">
                                        {/* Nội dung chính sách hậu mãi */}
                                        <p>Đây là nội dung chính sách hậu mãi...</p>
                                    </div>
                                </div>
                            )}

                            {/* Hiển thị câu hỏi thường gặp */}
                            {isFAQVisible && (
                                <div className="mx-auto max-w-[1100px] px-[10px] md:px-4 2xl:px-0">
                                    <div className="faq-content">
                                        {/* Nội dung câu hỏi thường gặp */}
                                        <p>Câu hỏi 1: ...</p>
                                        <p>Câu hỏi 2: ...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Khu vực Mô tả sản phẩm
                        <div className="mb-6">
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }} />
                        </div> */}
                    </div>

                    {/* Sản phẩm tương tự */}
                    <div className="mx-auto max-w-[1400px] px-[10px] md:px-4 2xl:px-0 mt-8">
                        <h2 className="text-2xl font-semibold mb-6">Sản phẩm tương tự</h2>
                        <div className="slider-container max-w-full mx-auto flex gap-8 overflow-x-auto no-scrollbar">
                            {similarProducts.length > 0 ? (
                                similarProducts.map((item) => (
                                    <Link
                                        to={`/product-detail/${item.product_id}`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        key={item.product_id}
                                        className="product-card bg-white shadow-lg rounded-lg overflow-hidden min-w-[280px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300"
                                        style={{ flexBasis: '280px' }}
                                    >
                                        <img
                                            src={
                                                item.ProductImages && item.ProductImages.length > 0
                                                    ? item.ProductImages[0].image_url
                                                    : "http://example.com/default-image.jpg"
                                            }
                                            alt={item.product_name}
                                            className="w-full h-[220px] object-cover"
                                        />
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold">{item.product_name}</h3>
                                            <p className="text-xl font-bold text-[#ad2a36]">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-4 text-center">Không có sản phẩm tương tự</div>
                            )}
                        </div>
                    </div>
                    <ViewedProducts />
                    <div className='mt-4'>
                        {user && (
                            <div>
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Viết đánh giá của bạn
                                </button>
                            </div>
                        )}
                        {/*Hiển thị rating summary*/}
                        {reviewSummary && (
                            <RatingSummary
                                avgRating={reviewSummary.avgRating}
                                totalReviews={reviewSummary.totalReviews}
                                ratingDistribution={reviewSummary.ratingDistribution}
                                positiveCount={reviewSummary.sentimentCount?.POS}
                            />
                        )}
                        {/* Hiển thị đánh giá */}
                        {reviews && reviews.length > 0 && (
                            <ReviewTabs reviews={reviews} />
                        )}
                    </div>
                </div>
            </div>
            {isReviewModalOpen &&
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSubmit={handleSubmitReview}
                />
            }
        </MainLayout>
    );
}

export default ProductDetail;