import React, { useState, useEffect } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import ProductAPI from "../../../api/productApi";
import categoryApi from "../../../api/categoryApi";
import subCategoryApi from "../../../api/subCategoryApi";
import Swal from "sweetalert2";
import { InputSwitch } from "primereact/inputswitch";


const EditProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
    const [isActive, setIsActive] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🛑 Quan trọng: Phải gọi getProductById
        const [product, categoriesData, subCategoriesData] = await Promise.all([
          ProductAPI.getProductById(id),
          categoryApi.getCategories(),
          subCategoryApi.getSubCategories(),
        ]);

        console.log("product", product);

        // 🟰 Gán dữ liệu sản phẩm vào form
        setProductName(product.product_name || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setQuantity(product.quantity || "");
        setCategoryId(product.category_id || "");
        setSubCategoryId(product.subcategory_id || "");

        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
        setIsActive(product.is_active || false);

      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ProductAPI.updateProduct(
        id,
        productName,
        description,
        price,
        quantity,
        categoryId,
        subCategoryId,
        null,
        isActive 
      );
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Sản phẩm đã được cập nhật.",
        confirmButtonText: "OK",
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi cập nhật nhóm sản phẩm!",
      });
    }
  };

  // Lọc subcategory theo categoryId
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === Number(categoryId)
  );

  return (
    <div className="flex flex-col flex-1 bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <Label>
                  Product Name <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="product_name"
                  id="product_name"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <Label>
                  Description <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price */}
              <div>
                <Label>
                  Price <span className="text-red">*</span>
                </Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div>
                <Label>
                  Quantity <span className="text-red">*</span>
                </Label>
                <Input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <Label>
                  Category <span className="text-red">*</span>
                </Label>
                <select
                  name="category"
                  id="category"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubCategoryId(""); // Reset Subcategory khi đổi Category
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubCategory */}
              {categoryId && (
                <div>
                  <Label>
                    SubCategory <span className="text-red">*</span>
                  </Label>
                  <select
                    name="subcategory"
                    id="subcategory"
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select SubCategory</option>
                    {filteredSubCategories.map((sub) => (
                      <option
                        key={sub.subcategory_id}
                        value={sub.subcategory_id}
                      >
                        {sub.subcategory_name}
                      </option>
                    ))}

                  </select>
                </div>
              )}
              <div className="flex items-center gap-4">
  <Label>Trạng thái mở bán:</Label>
  <InputSwitch checked={isActive} onChange={(e) => setIsActive(e.value)} />
  <span>{isActive ? "Đang mở bán" : "Đang dừng bán"}</span>
</div>


              {/* Submit Button */}
              <div>
                <Button type="submit" className="w-full">
                  Update Product
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
