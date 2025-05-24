import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Pagination,
  Stack,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ReactStars from "react-rating-stars-component";
import categoryApi from "../api/categoryApi";
import subcategoryApi from "../api/subCategoryApi";
import productApi from "../api/productApi";

const colors = {
  primary: "#b8860b",
  secondary: "#d4af37",
  textPrimary: "#4a3c31",
  textSecondary: "#7e705f",
  background: "#ffffff",
  borderLight: "#e4d6b0",
};

const sortOptions = [
  { name: "Mặc định", value: "default" },
  { name: "Giá: Thấp đến Cao", value: "price_asc" },
  { name: "Giá: Cao đến Thấp", value: "price_desc" },
  { name: "Đánh giá: Cao đến Thấp", value: "rating_desc" },
];

const SidebarFilter = ({
  categories,
  filteredSubcategories,
  tempFilters,
  updateTempFilter,
  applyFilters,
  isMobile,
  onClose,
}) => (
  <Box
    sx={{
      p: 3,
      width: { xs: 280, sm: 320 },
      height: "calc(100vh - 88px)",
      overflowY: "auto",
      bgcolor: colors.background,
      borderRadius: 1,
      "&::-webkit-scrollbar": { width: "6px" },
      "&::-webkit-scrollbar-thumb": { backgroundColor: colors.primary, borderRadius: "3px" },
      "&::-webkit-scrollbar-track": { backgroundColor: "#f0e6d2" },
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight={600} sx={{ color: colors.textPrimary }}>
        Bộ lọc
      </Typography>
      {isMobile && (
        <IconButton onClick={onClose} sx={{ color: colors.primary }}>
          <CloseIcon />
        </IconButton>
      )}
    </Stack>
    <Divider sx={{ mb: 2, borderColor: colors.borderLight }} />

    <FormControl fullWidth margin="normal">
      <InputLabel sx={{ color: colors.textSecondary }}>Chủng loại</InputLabel>
      <Select
        value={tempFilters.category ?? ""}
        label="Chủng loại"
        onChange={(e) => updateTempFilter("category", e.target.value || null)}
        sx={{
          color: colors.textPrimary,
          "& .MuiSelect-icon": { color: colors.primary },
        }}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.category_id} value={cat.category_id}>
            {cat.category_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth margin="normal" disabled={!tempFilters.category}>
      <InputLabel sx={{ color: colors.textSecondary }}>Chủng loại con</InputLabel>
      <Select
        value={tempFilters.subcategory ?? ""}
        label="Chủng loại con"
        onChange={(e) => updateTempFilter("subcategory", e.target.value || null)}
        sx={{
          color: colors.textPrimary,
          "& .MuiSelect-icon": { color: colors.primary },
        }}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {filteredSubcategories.map((subcat) => (
          <MenuItem key={subcat.subcategory_id} value={subcat.subcategory_id}>
            {subcat.subcategory_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Box my={2}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: colors.textPrimary }}>
        Đánh giá tối thiểu
      </Typography>
      <ReactStars
        count={5}
        size={28}
        activeColor={colors.primary}
        value={tempFilters.rating}
        isHalf={false}
        onChange={(newRating) => updateTempFilter("rating", newRating)}
      />
    </Box>

    <FormControl fullWidth margin="normal">
      <InputLabel sx={{ color: colors.textSecondary }}>Sắp xếp</InputLabel>
      <Select
        value={tempFilters.sort.value}
        label="Sắp xếp"
        onChange={(e) => {
          const selectedSort = sortOptions.find((so) => so.value === e.target.value);
          updateTempFilter("sort", selectedSort || sortOptions[0]);
        }}
        sx={{
          color: colors.textPrimary,
          "& .MuiSelect-icon": { color: colors.primary },
        }}
      >
        {sortOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Box mt={3} display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={applyFilters}
        sx={{
          bgcolor: colors.primary,
          "&:hover": { bgcolor: colors.secondary },
        }}
      >
        Áp dụng
      </Button>
    </Box>
  </Box>
);

const ProductList = ({
  products,
  filters,
  totalProducts,
  loading,
  onPageChange,
  isMobile,
  keyword,
}) => (
  <Box
    sx={{
      height: "calc(100vh - 88px)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      "&::-webkit-scrollbar": { width: "6px" },
      "&::-webkit-scrollbar-thumb": { backgroundColor: colors.background, borderRadius: "3px" },
      "&::-webkit-scrollbar-track": { backgroundColor: "#ffffff" },
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      flexWrap="wrap"
    >
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ color: colors.textPrimary }}
        flex="1 1 auto"
        minWidth={240}
      >
        Kết quả tìm kiếm cho{" "}
        <Box component="span" sx={{ color: colors.secondary }}>
          {keyword || "tất cả"}
        </Box>
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" minWidth={120}>
        {totalProducts.toLocaleString()} sản phẩm
      </Typography>
    </Box>

    {loading ? (
      <Box display="flex" justifyContent="center" py={20} flexGrow={1}>
        <CircularProgress color="secondary" size={48} />
      </Box>
    ) : products.length > 0 ? (
      <Grid container spacing={3} flexGrow={1}>
        {products.map((product) => (
          <Grid key={product.product_id} item xs={12} sm={3} md={3} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 10,
          flexGrow: 1,
        }}
      >
        <img
          src="https://www.pnj.com.vn/site/assets/images/empty_product_line.png"
          alt="empty"
          style={{ width: 160, height: "auto", marginBottom: 16 }}
        />
        <Typography variant="body1" align="center" color="text.secondary">
          Không tìm thấy sản phẩm phù hợp
        </Typography>
      </Box>
    )}

    {totalProducts > filters.limit && (
      <Box display="flex" justifyContent="center" mt={6} pb={2}>
        <Pagination
          count={Math.ceil(totalProducts / filters.limit)}
          page={filters.page}
          onChange={onPageChange}
          color="secondary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          size={isMobile ? "small" : "medium"}
          showFirstButton
          showLastButton
        />
      </Box>
    )}
  </Box>
);

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(console.error);
    subcategoryApi.getSubCategories().then(setSubcategories).catch(console.error);
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
    if (!filters.keyword || filters.keyword.trim() === "") {
      setProducts([]);
      setTotalProducts(0);
      return;
    }
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
          ratingMax: filters.rating > 0 ? filters.rating : null,
          limit: filters.limit,
          page: filters.page,
          sortField,
          sortOrder,
        });

        const safeProducts = res.data.map((product) => ({
          ...product,
          ProductImages: Array.isArray(product.ProductImages) ? product.ProductImages : [],
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

  const filteredSubcategories = tempFilters.category
    ? subcategories.filter((sc) => sc.category_id === Number(tempFilters.category))
    : subcategories;

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
    if (tempFilters.subcategory) params.set("subcategory", tempFilters.subcategory);
    if (tempFilters.rating > 0) params.set("rating", tempFilters.rating.toString());
    if (tempFilters.sort && tempFilters.sort.value !== "default")
      params.set("sort", tempFilters.sort.value);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`, { replace: true });
    if (isMobile) setDrawerOpen(false);
  };

  const onPageChange = (e, pageNum) => {
    if (pageNum < 1 || pageNum > Math.ceil(totalProducts / filters.limit)) return;

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
      <Box sx={{ bgcolor: colors.background, minHeight: "100vh", py: 4 }}>
        {/* Mobile filter button */}
        {isMobile && (
          <Box mb={2} px={2} display="flex" justifyContent="flex-start">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ color: colors.primary, borderColor: colors.primary }}
            >
              Bộ lọc
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 4,
            px: isMobile ? 2 : 6,
            height: "calc(100vh - 88px)",
          }}
        >
          {/* Sidebar filters */}
          {!isMobile ? (
            <Box
              sx={{
                flex: "0 0 320px",
                height: "100%",
                overflowY: "auto",
                bgcolor: colors.background,
                borderRadius: 1,
              }}
            >
              <SidebarFilter
                categories={categories}
                filteredSubcategories={filteredSubcategories}
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                applyFilters={applyFilters}
                isMobile={isMobile}
                onClose={() => setDrawerOpen(false)}
              />
            </Box>
          ) : (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              ModalProps={{ keepMounted: true }}
            >
              <SidebarFilter
                categories={categories}
                filteredSubcategories={filteredSubcategories}
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                applyFilters={applyFilters}
                isMobile={isMobile}
                onClose={() => setDrawerOpen(false)}
              />
            </Drawer>
          )}

          {/* Product list */}
          <Box
            sx={{
              flex: "1 1 auto",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ProductList
              products={products}
              filters={filters}
              totalProducts={totalProducts}
              loading={loading}
              onPageChange={onPageChange}
              isMobile={isMobile}
              keyword={filters.keyword}
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Search;