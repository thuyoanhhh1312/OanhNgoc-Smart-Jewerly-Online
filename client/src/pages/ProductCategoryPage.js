import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "../api/productApi"; // API lấy sản phẩm, bạn tự tạo
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";

const ProductCategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("products", products);

  // Giả sử backend bạn có API lấy sản phẩm theo category slug hoặc tên
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Bạn tùy chỉnh api gọi theo categorySlug tương ứng
        const data = await productApi.getProductsByCategory(categorySlug);
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (products.length === 0)
    return <div>Không có sản phẩm trong danh mục này.</div>;

  return (
    <MainLayout>
      <div>
        <h1>{categorySlug}</h1>
        <div className="p-[40px] grid grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCategoryPage;
