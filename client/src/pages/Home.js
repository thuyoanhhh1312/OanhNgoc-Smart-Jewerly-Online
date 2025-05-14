import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import MainLayout from '../layout/MainLayout';
import ProductApi from '../api/productApi';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { BannerTabSaleMay, BannerTopProduct } from '../assets';

const LazyProductCard = lazy(() => import('../components/ui/product/productCard'));

const Home = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const res = await ProductApi.getProducts();
            setProducts(res);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const LazyLoadProductCard = ({ product }) => {
        const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });

        return (
            <div ref={ref}>
                {inView ? (
                    <LazyProductCard product={product} />
                ) : (
                    <div className="h-[350px] bg-gray-100 rounded" />
                )}
            </div>
        );
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <MainLayout>
            {/* Banner Carousel */}
            <div className='mb-2'>
                <Carousel infiniteLoop={true} autoPlay={true} renderThumbs={() => { }}>
                    <div>
                        <img src={BannerTabSaleMay} alt='tab-sale' />
                    </div>
                    <div>
                        <img src={BannerTopProduct} alt='top-product' />
                    </div>
                </Carousel>
            </div>

            <Suspense fallback={<div className="text-center text-gray-500 py-10">Đang tải sản phẩm...</div>}>
                <div className='p-[40px] grid grid-cols-4 gap-4'>
                    {products.map((product, index) => (
                        <LazyLoadProductCard key={index} product={product} />
                    ))}
                </div>
            </Suspense>
        </MainLayout>
    );
};

export default Home;
