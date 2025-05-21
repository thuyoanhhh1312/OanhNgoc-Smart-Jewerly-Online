import React, { useEffect, useState } from "react";
import promotionApi from "../api/promotionApi"; // import api khuyến mãi của bạn
import MainLayout from "../layout/MainLayout";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionApi.getPromotions();
        setPromotions(data);
      } catch (err) {
        setError("Lỗi khi tải danh sách khuyến mãi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return <MainLayout><div>Đang tải khuyến mãi...</div></MainLayout>;
  if (error) return <MainLayout><div className="text-red-600">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Danh sách Khuyến Mãi</h1>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Mã giảm giá</th>
              <th className="border px-4 py-2 text-left">Phần trăm giảm</th>
              <th className="border px-4 py-2 text-left">Ngày bắt đầu</th>
              <th className="border px-4 py-2 text-left">Ngày kết thúc</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id || promo.promotion_id}>
                <td className="border px-4 py-2">{promo.promotion_code}</td>
                <td className="border px-4 py-2">{promo.discount}%</td>
                <td className="border px-4 py-2">{new Date(promo.start_date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(promo.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default PromotionsPage;
