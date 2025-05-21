import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import PromotionAPI from "../../../api/promotionApi"; // Đường dẫn đến file promotionApi.js
import { Link } from "react-router";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const Promotion = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      const data = await PromotionAPI.getPromotions();
      setPromotions(data);
    };
    fetchPromotions();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Thao tác này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'HỦY',
    });

    if (result.isConfirmed) {
      try {
        await PromotionAPI.deleteSubCategory(id, user?.token);

        setPromotions(promotions.filter((pro) => pro.promotion_id !== id));

        Swal.fire("Đã xóa!", "Danh mục đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa danh mục!", "error");
      }
    }
  };

  const createdDateBodyTemplate = (rowData) => {
    const createdAt = rowData.created_at;
    return (
      <div>
        {createdAt ? (
          <p className="text-gray-700">
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  const discountBodyTemplate = (rowData) => {
    return <span>{rowData.discount}%</span>;
  };

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md">
      {/* Tiêu đề */}
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-[32px] font-bold ">Promotion List</h1>
        <Link to="/admin/promotions/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add Promotion
          </button>
        </Link>
      </div>

      <DataTable
        value={promotions}
        paginator
        rows={10}
        showGridlines
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      >
        <Column
          field="promotion_id"
          header="ID"
          sortable
          headerClassName="bg-[#d2d4d6]"
        ></Column>
        <Column
          field="promotion_code"
          header="Mã khuyến mãi"
          sortable
          headerClassName="bg-[#d2d4d6]"
        ></Column>
        <Column
          field="description"
          header="Mô tả"
          sortable
          headerClassName="bg-[#d2d4d6]"
        ></Column>
        <Column
          field="discount"
          header="Phần trăm giảm giá"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={discountBodyTemplate}
        ></Column>
        <Column
          field="start_date"
          header="Ngày bắt đầu"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={createdDateBodyTemplate}
        ></Column>
        <Column
          field="end_date"
          header="Ngày kết thúc"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={createdDateBodyTemplate}
        ></Column>
        <Column
          body={(rowData) => (
            <div className="flex flex-row gap-2">
              <Link to={`/admin/promotions/edit/${rowData.promotion_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Edit
                </button>
              </Link>
              {/* Xóa nút điều hướng */}
              <button
                onClick={() => handleDelete(rowData.promotion_id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          )}
          headerStyle={{ width: "8rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
          headerClassName="bg-[#d2d4d6]"
        ></Column>
      </DataTable>
    </div>
  );
};

export default Promotion;
