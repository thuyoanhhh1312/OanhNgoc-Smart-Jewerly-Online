import React, { useState, useEffect } from 'react';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Button from '../../../components/ui/button/Button';
import { useNavigate } from 'react-router';
import subCategoryApi from '../../../api/subCategoryApi';
import categoryApi from '../../../api/categoryApi'; // API cho Category

const AddSubCategory = () => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await subCategoryApi.createSubCategory(
            subCategoryName,
            description,
            Number(categoryId)
          );
  
      setSubCategoryName('');
      setDescription('');
      setCategoryId('');
  
      navigate('/subcategories');
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };
  

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} method="POST">
          <div className="space-y-6">
            {/* Subcategory Name */}
            <div>
              <Label>Subcategory Name <span className="text-red">*</span></Label>
              <Input
                type="text"
                name="subcategory_name"
                id="subcategory_name"
                placeholder="Subcategory Name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description <span className="text-red">*</span></Label>
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
              <Button type="submit" className="w-full">Add Subcategory</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
