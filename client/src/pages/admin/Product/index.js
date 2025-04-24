import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from "react";
import ProductAPI from "../../../api/productApi"; // Đường dẫn đến file productApi.js
import { Link } from "react-router";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await ProductAPI.getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    //await deleteProduct(id);
    setProducts(products.filter((product) => product.product_id !== id));
  };

  return (
    <div className='bg-[#FFFFFF] p-4 rounded-lg shadow-md'>
      {/* Tiêu đề */}
      <div className='flex flex-row justify-between items-center mb-4'>
        <h1 className='text-[32px] font-bold '>Product List</h1>
        <div>
          {/* Thêm nút điều hướng */}
          <Link to="/products/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Product</button>
          </Link>
        </div>
      </div>
      
      <DataTable value={products} paginator rows={10} showGridlines paginatorTemplate="PrevPageLink PageLinks NextPageLink">
        <Column field="product_id" header="ID" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="product_name" header="Product Name" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="description" header="Description" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="price" header="Price" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column field="quantity" header="Quantity" sortable headerClassName='bg-[#d2d4d6]'></Column>
        <Column
          body={(rowData) => (
            <div className='flex flex-row gap-2'>
              <Link to={`/products/edit/${rowData.product_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Edit
                </button>
              </Link>
              <button onClick={() => handleDelete(rowData.product_id)} className="bg-red-500 text-white px-4 py-2 rounded">
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

export default Product;
