import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from "react";
import PromotionAPI from "../../../api/promotionApi"; // Đường dẫn đến file promotionApi.js
import { Link } from "react-router";
import { useSelector } from "react-redux";

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
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
            try {
                await PromotionAPI.deletePromotion(id, user.token);
                alert("Xóa khuyến mãi thành công!");
                // Xóa khỏi danh sách hiển thị
                setPromotions(promotions.filter((promotion) => promotion.promotion_id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa khuyến mãi:", error);
                alert("Đã xảy ra lỗi khi xóa khuyến mãi!");
            }
        }
    };

    return (
        <div className='bg-[#FFFFFF] p-4 rounded-lg shadow-md'>
            {/* Tiêu đề */}
            <div className='flex flex-row justify-between items-center mb-4'>
                <h1 className='text-[32px] font-bold '>Promotion List</h1>
                <div>
                    {/* Thêm nút điều hướng */}
                    <Link to="/admin/promotions/add">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Promotion</button>
                    </Link>
                </div>
            </div>

            <DataTable value={promotions} paginator rows={10} showGridlines paginatorTemplate="PrevPageLink PageLinks NextPageLink">
                <Column field="promotion_id" header="ID" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="promotion_code" header="Promotion Code" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="description" header="Description" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="discount" header="Discount" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="start_date" header="Start Date" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="end_date" header="End Date" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column
                    body={(rowData) => (
                        <div className='flex flex-row gap-2'>
                            <Link to={`/admin/promotions/edit/${rowData.promotion_id}`}>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">
                                    Edit
                                </button>
                            </Link>
                            {/* Xóa nút điều hướng */}
                            <button onClick={() => handleDelete(rowData.promotion_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    )}
                    headerStyle={{ width: '8rem', textAlign: 'center' }}
                    bodyStyle={{ textAlign: 'center' }}
                    headerClassName='bg-[#d2d4d6]'
                ></Column>
            </DataTable>
        </div>
    );
};

export default Promotion;