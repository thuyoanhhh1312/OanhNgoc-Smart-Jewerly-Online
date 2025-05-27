import React, { useState, useEffect, lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import MainLayout from "../layout/MainLayout";
import ProductApi from "../api/productApi";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { BannerTabSaleMay, BannerTopProduct } from "../assets";
import BenefitCard from "../components/ui/home/HomeBenefitCard";
import { ToastContainer } from "react-toastify";

const LazyProductCard = lazy(() =>
  import("../components/ui/product/productCard")
);

const Home = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await ProductApi.getProductWithReviewSummary();
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

  const benefitItems = [
    {
      title: "MIỄN PHÍ",
      subtitle: "VẬN CHUYỂN",
      icon: "https://cdn.pnj.io/images/2023/relayout-pdp/shipping-icon.svg",
      tooltip: (
        <>
          <strong>Miễn phí giao hàng trong 3 giờ.</strong> Nếu giao trễ, tặng
          ngay voucher 100k cho lần mua hàng tiếp theo.
        </>
      ),
    },
    {
      title: "PHỤC VỤ 24/7",
      subtitle: "",
      icon: "https://cdn.pnj.io/images/2023/relayout-pdp/shopping%20247-icon.svg",
      tooltip: (
        <>Khách hàng có thể xem, đặt hàng và thanh toán 24/7 tại website PNJ.</>
      ),
    },
    {
      title: "THU ĐỔI 48H",
      subtitle: "",
      icon: "https://cdn.pnj.io/images/2023/relayout-pdp/thudoi-icon.svg",
      tooltip: (
        <>
          <strong>
            Áp dụng đổi 48 giờ đối với trang sức vàng và 72 giờ đối với trang
            sức bạc (chỉ đổi size).
          </strong>
          <br />
          Tính từ lúc cửa hàng xuất hóa đơn (nhận tại cửa hàng) hoặc khi khách
          hàng nhận được sản phẩm (giao hàng tận nơi).
        </>
      ),
    },
  ];

  return (
    <MainLayout>
      {/* Banner Carousel */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-2">
        <Carousel
          infiniteLoop={true}
          interval={1500}
          autoPlay={true}
          renderThumbs={() => { }}
        >
          <div>
            <img src={BannerTabSaleMay} alt="tab-sale" />
          </div>
          <div>
            <img src={BannerTopProduct} alt="top-product" />
          </div>
        </Carousel>
      </div>
      {/* Benefit Cards */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 max-w-[860px] sm:mx-auto my-4 px-4">
        {benefitItems.map((item, index) => (
          <BenefitCard key={index} {...item} />
        ))}
      </div>
      <Suspense
        fallback={
          <div className="text-center text-gray-500 py-10">
            Đang tải sản phẩm...
          </div>
        }
      >
        <div className="p-4 sm:p-8 max-w-auto w-auto mx-auto flex justify-center">
          <div
            className="
              grid grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-4
            "
          >
            {products.map((product, index) => (
              <LazyLoadProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </Suspense>
    </MainLayout>
  );
};

export default Home;