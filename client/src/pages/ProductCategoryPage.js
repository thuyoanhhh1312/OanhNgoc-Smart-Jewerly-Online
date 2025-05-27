import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "../api/productApi";
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";
import Breadcrumb from "../components/ui/Breadcrumb";
import { ToastContainer } from "react-toastify";

const ProductCategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const decodedCategoryName = decodeURIComponent(categoryName);
        const data = await productApi.getProductsByCategory(decodedCategoryName);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          setError("Dữ liệu sản phẩm trả về không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm theo category:", err);
        setError("Lỗi khi lấy sản phẩm, vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  const decodedCategoryName = decodeURIComponent(categoryName);

  const breadcrumbItems = [
    { label: "Trang chủ", to: "/" },
    { label: decodedCategoryName },
  ];

  return (
    <MainLayout>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <Breadcrumb items={breadcrumbItems} />

        {loading && (
          <div className="text-center text-gray-600 text-lg py-20">
            Đang tải sản phẩm...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 text-lg py-20">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-500 text-lg py-20">
            Không có sản phẩm trong danh mục này.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            className="
              mt-6
              grid grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.product_id || product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductCategoryPage;