import db from '../models/index.js';

export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await db.SubCategory.findAll({
      include: {
        model: db.Category,
        attributes: ['category_name'],
      },
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục con", error: error.message });
  }
};

export const getSubCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await db.SubCategory.findByPk(id, {
      include: {
        model: db.Category,
        attributes: ['category_name'],
      },
    });
    if (!subCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục con", error: error.message });
  }
};

export const createSubCategory = async (req, res) => {
  const { subcategory_name, description, category_id } = req.body;
  try {
    const newSubCategory = await db.SubCategory.create({
      subcategory_name,
      description,
      category_id,
    });
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo danh mục con", error: error.message });
  }
};

export const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { subcategory_name, description, category_id } = req.body;

  try {
    const subcategory = await db.SubCategory.findByPk(id);

    if (!subcategory) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm sản phẩm.' });
    }

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

export const deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await db.SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục con" });
    }
    await subCategory.destroy();
    res.status(200).json({ message: "Xóa danh mục con thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa danh mục con", error: error.message });
  }
};
