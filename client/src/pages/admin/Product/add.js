import React, { useState, useEffect } from 'react';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Button from '../../../components/ui/button/Button';
import { useNavigate } from 'react-router';
import ProductAPI from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';  // API cho Category

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  // Fetch danh sách danh mục khi trang được load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);  // Set danh sách danh mục vào state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi dữ liệu lên API để tạo sản phẩm
      const response = await ProductAPI.createProduct(
        productName,
        description,
        price,
        quantity,
        categoryId,
        imageUrl
      );
      
      // Reset form sau khi tạo sản phẩm thành công
      setProductName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setCategoryId('');
      setImageUrl('');

      // Chuyển hướng về trang danh sách sản phẩm
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <Label>Product Name <span className="text-red">*</span></Label>
                <Input 
                  type="text"
                  name="product_name"
                  id="product_name"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e?.target?.value)}
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
                  onChange={(e) => setDescription(e?.target?.value)}
                />
              </div>

              {/* Price */}
              <div>
                <Label>Price <span className="text-red">*</span></Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e?.target?.value)}
                />
              </div>

              {/* Quantity */}
              <div>
                <Label>Quantity <span className="text-red">*</span></Label>
                <Input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e?.target?.value)}
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category <span className="text-red">*</span></Label>
                <select
                  name="category"
                  id="category"
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

              {/* Image URL */}
              <div>
                <Label>Image URL <span className="text-red">*</span></Label>
                <Input
                  type="text"
                  name="image_url"
                  id="image_url"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e?.target?.value)}
                />
              </div>

              {/* Submit Button */}
              <div>
                <Button type="submit" className="w-full">Add Product</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
