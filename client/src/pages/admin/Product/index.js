import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import ProductAPI from "../../../api/productApi";
import { Link } from "react-router";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { Image } from "primereact/image";
import { InputSwitch } from "primereact/inputswitch";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(null); // lưu product_id đang update trạng thái

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductAPI.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
        Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm.", "error");
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "HỦY",
    });

    if (result.isConfirmed) {
      try {
        await ProductAPI.deleteProduct(id);
        setProducts(products.filter((product) => product.product_id !== id));
        Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa sản phẩm!", "error");
      }
    }
  };

  const descriptionBodyTemplate = (rowData) => {
    const description = rowData?.description;

    return description ? (
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
    ) : (
      <p></p>
    );
  };

  const imageBodyTemplate = (rowData) => {
    const images = rowData?.ProductImages || [];

    return (
      <div className="flex flex-wrap gap-2">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Image
              key={index}
              src={image.image_url}
              alt={image.alt_text || `Image ${index + 1}`}
              width="80"
              height="60"
              preview
            />
          ))
        ) : (
          <span>Empty Image</span>
        )}
      </div>
    );
  };

  // Hàm xử lý bật tắt trạng thái bán
  const toggleStatus = async (product) => {
    setLoadingStatus(product.product_id);
    try {
      await ProductAPI.updateProduct(
        product.product_id,
        product.product_name,
        product.description,
        product.price,
        product.quantity,
        product.category_id,
        product.subcategory_id,
        null,
        !product.is_active
      );

      // Cập nhật local state
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product.product_id ? { ...p, is_active: !p.is_active } : p
        )
      );

      Swal.fire("Thành công", "Cập nhật trạng thái thành công", "success");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
    } finally {
      setLoadingStatus(null);
    }
  };

  // Cột trạng thái bán
  const statusBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center items-center gap-2">
        <InputSwitch
          checked={rowData.is_active}
          disabled={loadingStatus === rowData.product_id}
          onChange={() => toggleStatus(rowData)}
        />
        <span>{rowData.is_active ? "Đang mở bán" : "Đang dừng bán"}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-[32px] font-bold ">Product List</h1>
        <div>
          <Link to="/admin/products/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Product</button>
          </Link>
        </div>
      </div>

      <DataTable
        value={products}
        paginator
        rows={10}
        showGridlines
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      >
        <Column field="product_name" header="Tên sản phẩm" sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="ProductImages" header="Hình ảnh" body={imageBodyTemplate} sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="description" header="Mô tả" body={descriptionBodyTemplate} sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="price" header="Giá" sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="quantity" header="Số lượng" sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="Category.category_name" header="Danh mục" sortable headerClassName="bg-[#d2d4d6]" />
        <Column field="SubCategory.subcategory_name" header="Danh mục con" sortable headerClassName="bg-[#d2d4d6]" />
        
        <Column header="Trạng thái bán" body={statusBodyTemplate} headerClassName="bg-[#d2d4d6]" style={{ width: '150px', textAlign: 'center' }} />

        <Column
          body={(rowData) => (
            <div className="flex flex-row gap-2">
              <Link to={`/admin/products/edit/${rowData.product_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
              </Link>
              
            </div>
          )}
          header="Actions"
          headerClassName="bg-[#d2d4d6]"
        />
      </DataTable>
    </div>
  );
};

export default Product;
