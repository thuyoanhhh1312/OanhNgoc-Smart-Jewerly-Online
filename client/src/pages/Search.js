import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Backdrop,
  Box,
  Typography,
} from "@mui/material";

import ReactStars from "react-rating-stars-component";

import categoryApi from "../api/categoryApi";
import subcategoryApi from "../api/subCategoryApi";
import productApi from "../api/productApi";

const ratingOptions = [0, 1, 2, 3, 4, 5];
const sortOptions = [
  { name: "Mặc định", value: "default" },
  { name: "Giá: Thấp đến Cao", value: "price_asc" },
  { name: "Giá: Cao đến Thấp", value: "price_desc" },
  { name: "Đánh giá: Cao đến Thấp", value: "rating_desc" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const range = (start, end) => {
    let arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  let pages = [];

  if (totalPages <= 7) {
    pages = range(1, totalPages);
  } else {
    if (currentPage <= 4) {
      pages = [...range(1, 5), "...", totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [1, "...", ...range(totalPages - 4, totalPages)];
    } else {
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  }

  return (
    <nav
      className="mt-6 flex justify-center items-center select-none space-x-1"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-indigo-100"
        aria-label="Trang trước"
      >
        ‹
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="px-3 py-1 text-gray-500 cursor-default select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={classNames(
              "px-3 py-1 rounded border border-gray-300 hover:bg-indigo-100",
              page === currentPage
                ? "bg-indigo-600 text-white cursor-default"
                : "bg-white text-gray-700"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-indigo-100"
        aria-label="Trang sau"
      >
        ›
      </button>
    </nav>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: null,
    subcategory: null,
    rating: 0,
    sort: sortOptions[0],
    keyword: "",
    page: 1,
    limit: 20,
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoryApi.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    async function loadSubcategories() {
      try {
        const subs = await subcategoryApi.getSubCategories();
        setSubcategories(subs);
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
    loadSubcategories();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const urlCategory = searchParams.get("category");
    const urlSubcategory = searchParams.get("subcategory");
    const urlRating = parseInt(searchParams.get("rating") || "0", 10);
    const urlSortValue = searchParams.get("sort") || "default";
    const urlKeyword = searchParams.get("keyword") || "";
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    const sortObj =
      sortOptions.find((so) => so.value === urlSortValue) || sortOptions[0];

    const newFilters = {
      category: urlCategory ? Number(urlCategory) : null,
      subcategory: urlSubcategory ? Number(urlSubcategory) : null,
      rating: isNaN(urlRating) ? 0 : urlRating,
      sort: sortObj,
      keyword: urlKeyword,
      page: isNaN(urlPage) ? 1 : urlPage,
      limit: 20,
    };

    setFilters(newFilters);
    setTempFilters(newFilters);
  }, [location.search]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let sortField = "product_name";
        let sortOrder = "ASC";

        switch (filters.sort.value) {
          case "price_asc":
            sortField = "price";
            sortOrder = "ASC";
            break;
          case "price_desc":
            sortField = "price";
            sortOrder = "DESC";
            break;
          case "rating_desc":
            sortField = "avg_rating";
            sortOrder = "DESC";
            break;
          default:
            sortField = "product_name";
            sortOrder = "ASC";
        }

        const res = await productApi.searchProduct({
          keyword: filters.keyword,
          categoryId: filters.category,
          subcategoryId: filters.subcategory,
          rating_min: filters.rating > 0 ? filters.rating : null,
          limit: filters.limit,
          page: filters.page,
          sortField,
          sortOrder,
        });

        const safeProducts = res.data.map((product) => ({
          ...product,
          ProductImages: Array.isArray(product.ProductImages)
            ? product.ProductImages
            : [],
        }));

        setProducts(safeProducts);
        setTotalProducts(res.pagination?.total || safeProducts.length);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadProducts();
  }, [filters]);

  const filteredSubcategories = filters.category
    ? subcategories.filter((sc) => sc.category_id === Number(filters.category))
    : [];

  const updateTempFilter = (key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "category" ? { subcategory: null } : {}),
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...tempFilters,
      page: 1,
    }));

    const params = new URLSearchParams();

    if (tempFilters.keyword) params.set("keyword", tempFilters.keyword);
    if (tempFilters.category) params.set("category", tempFilters.category);
    if (tempFilters.subcategory)
      params.set("subcategory", tempFilters.subcategory);
    if (tempFilters.rating > 0)
      params.set("rating", tempFilters.rating.toString());
    if (tempFilters.sort && tempFilters.sort.value !== "default")
      params.set("sort", tempFilters.sort.value);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const onPageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > Math.ceil(totalProducts / filters.limit))
      return;

    setFilters((prev) => ({
      ...prev,
      page: pageNum,
    }));

    const params = new URLSearchParams(location.search);
    params.set("page", pageNum.toString());

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Mobile filter modal */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          fullScreen
          TransitionComponent={Fade}
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Bộ lọc
            <Button onClick={() => setMobileFiltersOpen(false)}>Đóng</Button>
          </DialogTitle>
          <DialogContent dividers>
            {/* Category */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Chủng loại</InputLabel>
              <Select
                value={tempFilters.category ?? ""}
                label="Chủng loại"
                onChange={(e) => updateTempFilter("category", e.target.value || null)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory */}
            <FormControl fullWidth margin="normal" disabled={!tempFilters.category}>
              <InputLabel>Chủng loại con</InputLabel>
              <Select
                value={tempFilters.subcategory ?? ""}
                label="Chủng loại con"
                onChange={(e) => updateTempFilter("subcategory", e.target.value || null)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {filteredSubcategories.map((subcat) => (
                  <MenuItem key={subcat.subcategory_id} value={subcat.subcategory_id}>
                    {subcat.subcategory_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rating */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Đánh giá tối thiểu
              </Typography>
              <ReactStars
                count={5}
                size={30}
                activeColor="#2563eb"
                value={tempFilters.rating}
                isHalf={false}
                onChange={(newRating) => updateTempFilter("rating", newRating)}
              />
            </Box>

            {/* Sort */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={tempFilters.sort.value}
                label="Sắp xếp"
                onChange={(e) => {
                  const selectedSort = sortOptions.find((so) => so.value === e.target.value);
                  updateTempFilter("sort", selectedSort || sortOptions[0]);
                }}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Apply button */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={() => {
                applyFilters();
                setMobileFiltersOpen(false);
              }}>
                Áp dụng
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Desktop filter */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <Typography variant="h6" gutterBottom>
              Bộ lọc
            </Typography>

            {/* Category */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Chủng loại</InputLabel>
              <Select
                value={tempFilters.category ?? ""}
                label="Chủng loại"
                onChange={(e) => updateTempFilter("category", e.target.value || null)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory */}
            <FormControl fullWidth margin="normal" disabled={!tempFilters.category}>
              <InputLabel>Chủng loại con</InputLabel>
              <Select
                value={tempFilters.subcategory ?? ""}
                label="Chủng loại con"
                onChange={(e) => updateTempFilter("subcategory", e.target.value || null)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {filteredSubcategories.map((subcat) => (
                  <MenuItem key={subcat.subcategory_id} value={subcat.subcategory_id}>
                    {subcat.subcategory_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rating */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Đánh giá tối thiểu
              </Typography>
              <ReactStars
                count={5}
                size={30}
                activeColor="#2563eb"
                value={tempFilters.rating}
                isHalf={false}
                onChange={(newRating) => updateTempFilter("rating", newRating)}
              />
            </Box>

            {/* Sort */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={tempFilters.sort.value}
                label="Sắp xếp"
                onChange={(e) => {
                  const selectedSort = sortOptions.find((so) => so.value === e.target.value);
                  updateTempFilter("sort", selectedSort || sortOptions[0]);
                }}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Apply button desktop */}
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" fullWidth onClick={applyFilters}>
                Áp dụng
              </Button>
            </Box>
          </aside>

          {/* Product List and Pagination */}
          <section className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">
                Kết quả tìm kiếm cho{" "}
                <span className="text-indigo-600">
                  {filters.keyword || "tất cả"}
                </span>
              </h1>
              <span className="text-gray-500">{totalProducts} sản phẩm</span>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">Đang tải...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.product_id} product={product} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">
                      Không tìm thấy sản phẩm phù hợp
                    </p>
                  )}
                </div>

                <Pagination
                  currentPage={filters.page}
                  totalPages={Math.ceil(totalProducts / filters.limit)}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default Search;