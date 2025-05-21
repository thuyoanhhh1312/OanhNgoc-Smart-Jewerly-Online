import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "../api/productApi";
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";

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
        // decode để categoryName không bị lỗi khi có dấu hoặc ký tự đặc biệt
        const decodedCategoryName = decodeURIComponent(categoryName);

        const data = await productApi.getProductsByCategory(
          decodedCategoryName
        );

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

  if (loading)
    return (
      <MainLayout>
        <div>Đang tải sản phẩm...</div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="text-red-600">{error}</div>
      </MainLayout>
    );

  if (products.length === 0)
    return (
      <MainLayout>
        <div>Không có sản phẩm trong danh mục này.</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">
          {decodeURIComponent(categoryName)}
        </h1>
        <div className="p-[40px] grid grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.product_id || product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCategoryPage;
    