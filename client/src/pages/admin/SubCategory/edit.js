import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import SubCategoryAPI from "../../../api/subCategoryApi";
import categoryApi from "../../../api/categoryApi"; // Để lấy danh sách Category
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subcategoryName, setSubcategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subCategoryData, categoriesData] = await Promise.all([
          SubCategoryAPI.getSubCategoryById(id),
          categoryApi.getCategories(),
        ]);

        setSubcategoryName(subCategoryData.subcategory_name || '');
        setDescription(subCategoryData.description || '');
        setCategoryId(subCategoryData.category_id || '');
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading subcategory:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
try {
    if (!subcategoryName || !categoryId) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    await SubCategoryAPI.updateSubCategory(id, {
      subcategory_name: subcategoryName,
      description,
      category_id: Number(categoryId),
    });
    alert('Cập nhật nhóm sản phẩm thành công!');
    navigate('/subcategories');
  } catch (error) {
    console.error('Error updating subcategory:', error.response?.data || error.message);
    alert('Đã xảy ra lỗi khi cập nhật nhóm sản phẩm!');
  }
  };

  return (
    <div className="flex flex-col flex-1 bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} method="POST">
          <div className="space-y-6">
            {/* SubCategory Name */}
            <div>
              <Label>SubCategory Name <span className="text-red">*</span></Label>
              <Input
                type="text"
                name="subcategory_name"
                id="subcategory_name"
                placeholder="SubCategory Name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category <span className="text-red">*</span></Label>
              <select
                name="category_id"
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">Update SubCategory</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubCategory;
