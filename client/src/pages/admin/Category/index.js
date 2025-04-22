// import React from "react";

// const Category = () => {
//     return (
//         <div>
//             <button className="btn btn-primary">Add Category</button>
//         </div>
//     )
// }

// export default Category;

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
    <div>
      <h1>Category List</h1>
      <div>
        {/* Thêm nút điều hướng */}
        <Link to="/add-category">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Category</button>
        </Link>
      </div>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>
            {category.category_name} - {category.description}
            <button onClick={() => handleDelete(category.category_id)}>Delete</button>
            <Link to={`/edit-category/${category.category_id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;