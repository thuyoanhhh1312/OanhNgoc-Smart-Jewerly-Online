import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import SubCategoryAPI from "../../../api/subCategoryApi"; // Đường dẫn đến file subCategoryApi.js
import { Link } from "react-router";

const SubCategory = () => {
    const[subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            const data = await SubCategoryAPI.getSubCategories();
            setSubCategories(data);
        };
        fetchSubCategories();
    }
, []);
const handleDelete = async (id) => {
    setSubCategories(subCategories.filter((subCategory) => subCategory.subcategory_id !== id));
};
return (
    
    <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md">
      {/* Tiêu đề */}
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-[32px] font-bold ">SubCategory List</h1>
        <div>
          {/* Thêm nút điều hướng */}
          <Link to="/subcategories/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New SubCategory</button>
          </Link>
        </div>
      </div>

      <DataTable value={subCategories} paginator rows={10} showGridlines paginatorTemplate="PrevPageLink PageLinks NextPageLink">
        <Column field="subcategory_id" header="ID" sortable headerClassName="bg-[#d2d4d6]"></Column>
        <Column field="subcategory_name" header="SubCategory Name" sortable headerClassName="bg-[#d2d4d6]"></Column>
        <Column field="description" header="Description" sortable headerClassName="bg-[#d2d4d6]"></Column>
        <Column field="Category.category_name" header="Category" sortable headerClassName="bg-[#d2d4d6]"></Column>
        <Column
          body={(rowData) => (
            <div className="flex flex-row gap-2">
              <Link to={`/subcategories/edit/${rowData.subcategory_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
              </Link>
              <button onClick={() => handleDelete(rowData.subCategory_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          )}
          header="Actions"
          headerClassName="bg-[#d2d4d6]"
        ></Column>
      </DataTable>
    </div>
  );
};
 export default SubCategory;