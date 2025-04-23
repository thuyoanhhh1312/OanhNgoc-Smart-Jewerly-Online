import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';      
import React, { useEffect, useState } from "react";
import CategoryAPI from "../../../api/categoryApi"; // Đường dẫn đến file categoryApi.js
import { Link } from "react-router";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await CategoryAPI.getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    //await deleteCategory(id);
    setCategories(categories.filter((category) => category.category_id !== id));
  };

  return (
    <div className='bg-[#FFFFFF] p-4 rounded-lg shadow-md'>
      {/* Tiêu đề */}
      <div className='flex flex-row justify-between items-center mb-4'>
        <h1 className='text-[32px] font-bold '>Category List</h1>
        <div>
          {/* Thêm nút điều hướng */}
          <Link to="/categories/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Category</button>
          </Link>
        </div>
      </div>
      
      <DataTable value={categories} paginator rows={10} showGridlines paginatorTemplate="PrevPageLink PageLinks NextPageLink">
        <Column field="category_id" header="ID" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="category_name" header="Category Name" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="description" header="Description" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column
          body={(rowData) => (
            <div className='flex flex-row gap-2'>
              <Link to={`/categories/edit/${rowData.category_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Edit
                </button>
              </Link>
              <button onClick={() => handleDelete(rowData.category_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>


            </div>
          )}
          header="Actions"
          headerClassName='bg-[#d2d4d6]'
        ></Column>
      </DataTable>
    </div>
  );
};

export default Category;