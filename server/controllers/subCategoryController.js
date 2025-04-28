const SubCategory = require('../models/subcategory');
const Category = require('../models/category');

const getAllSubCategories = async (req, res) => {
    
  try {
    const subCategories = await SubCategory.findAll({
      include: {
        model: Category,
        attributes: ['category_name'],
      },
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
}
const getSubCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const subCategory = await SubCategory.findByPk(id, {
        include: {
            model: Category,
            attributes: ['category_name'],
        },
        });
        if (!subCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategory", error: error.message });
    }
    }
    const createSubCategory = async (req, res) => {
        const { subcategory_name, description, category_id } = req.body;
        try {
            const newSubCategory = await SubCategory.create({
                subcategory_name,
                description,
                category_id
            });
            res.status(201).json(newSubCategory);
        } catch (error) {
            res.status(500).json({ message: "Error creating subcategory", error: error.message });
        }
    }
    // Update SubCategory
    const updateSubCategory = async (req, res) => {
      const { id } = req.params;
      const { subcategory_name, description, category_id } = req.body;
    
      try {
        const subcategory = await SubCategory.findByPk(id);
    
        if (!subcategory) {
          return res.status(404).json({ message: 'Không tìm thấy nhóm sản phẩm.' });
        }
    
        // Cập nhật dữ liệu
        subcategory.subcategory_name = subcategory_name || subcategory.subcategory_name;
        subcategory.description = description || subcategory.description;
        subcategory.category_id = category_id || subcategory.category_id;
    
        await subcategory.save();
    
        res.status(200).json({ message: 'Cập nhật nhóm sản phẩm thành công.', data: subcategory });
      } catch (error) {
        console.error('Lỗi khi cập nhật nhóm sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật nhóm sản phẩm.', error: error.message });
      }
    };
    
    const deleteSubCategory = async (req, res) => {
        const { id } = req.params;
        try {
            const subCategory = await SubCategory.findByPk(id);
            if (!subCategory) {
                return res.status(404).json({ message: "Subcategory not found" });
            }
            await subCategory.destroy();
            res.status(200).json({ message: "Subcategory deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting subcategory", error: error.message });
        }
    }
    module.exports = {
        getAllSubCategories,
        getSubCategoryById,
        createSubCategory,
        updateSubCategory,
        deleteSubCategory
    };