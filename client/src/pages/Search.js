import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProductCard from "../components/ui/product/productCard";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { XMarkIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
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
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                  <div className="px-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Bộ lọc
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Đóng bộ lọc</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <form className="mt-4 space-y-6 px-4">
                    {/* Category */}
                    <div>
                      <Listbox
                        value={tempFilters.category}
                        onChange={(val) => updateTempFilter("category", val)}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                              Chủng loại
                            </Listbox.Label>
                            <div className="relative">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <span className="block truncate">
                                  {tempFilters.category
                                    ? categories.find(
                                        (c) =>
                                          c.category_id === tempFilters.category
                                      )?.category_name
                                    : "Tất cả"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <Listbox.Option
                                    key="all"
                                    value={null}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                  >
                                    <span className="block truncate">
                                      Tất cả
                                    </span>
                                  </Listbox.Option>
                                  {categories.map((cat) => (
                                    <Listbox.Option
                                      key={cat.category_id}
                                      value={cat.category_id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                    >
                                      {({ selected }) => (
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate"
                                          )}
                                        >
                                          {cat.category_name}
                                        </span>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <Listbox
                        value={tempFilters.subcategory}
                        onChange={(val) => updateTempFilter("subcategory", val)}
                        disabled={!tempFilters.category}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                              Chủng loại con
                            </Listbox.Label>
                            <div className="relative">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50">
                                <span className="block truncate">
                                  {tempFilters.subcategory
                                    ? filteredSubcategories.find(
                                        (c) =>
                                          c.subcategory_id ===
                                          tempFilters.subcategory
                                      )?.subcategory_name
                                    : "Tất cả"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <Listbox.Option
                                    key="all"
                                    value={null}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                  >
                                    <span className="block truncate">
                                      Tất cả
                                    </span>
                                  </Listbox.Option>
                                  {filteredSubcategories.map((subcat) => (
                                    <Listbox.Option
                                      key={subcat.subcategory_id}
                                      value={subcat.subcategory_id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                    >
                                      {({ selected }) => (
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate"
                                          )}
                                        >
                                          {subcat.subcategory_name}
                                        </span>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đánh giá tối thiểu
                      </label>
                      <ReactStars
                        count={5}
                        size={30}
                        activeColor="#2563eb"
                        value={tempFilters.rating}
                        isHalf={false}
                        onChange={(newRating) =>
                          updateTempFilter("rating", newRating)
                        }
                      />
                    </div>

                    {/* Sort */}
                    <div>
                      <Listbox
                        value={tempFilters.sort}
                        onChange={(val) => updateTempFilter("sort", val)}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                              Sắp xếp
                            </Listbox.Label>
                            <div className="relative">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <span className="block truncate">
                                  {tempFilters.sort.name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {sortOptions.map((opt) => (
                                    <Listbox.Option
                                      key={opt.value}
                                      value={opt}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                    >
                                      {({ selected }) => (
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate"
                                          )}
                                        >
                                          {opt.name}
                                        </span>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          applyFilters();
                          setMobileFiltersOpen(false);
                        }}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop filter */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <h2 className="font-bold text-lg mb-4">Bộ lọc</h2>

            {/* Category */}
            <div className="mb-6">
              <Listbox
                value={tempFilters.category}
                onChange={(val) => updateTempFilter("category", val)}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Chủng loại
                    </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span className="block truncate">
                          {tempFilters.category
                            ? categories.find(
                                (c) => c.category_id === tempFilters.category
                              )?.category_name
                            : "Tất cả"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <Listbox.Option
                            key="all"
                            value={null}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                          >
                            <span className="block truncate">Tất cả</span>
                          </Listbox.Option>
                          {categories.map((cat) => (
                            <Listbox.Option
                              key={cat.category_id}
                              value={cat.category_id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                            >
                              {({ selected }) => (
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {cat.category_name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            {/* Subcategory */}
            <div className="mb-6">
              <Listbox
                value={tempFilters.subcategory}
                onChange={(val) => updateTempFilter("subcategory", val)}
                disabled={!tempFilters.category}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Chủng loại con
                    </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50">
                        <span className="block truncate">
                          {tempFilters.subcategory
                            ? filteredSubcategories.find(
                                (c) =>
                                  c.subcategory_id === tempFilters.subcategory
                              )?.subcategory_name
                            : "Tất cả"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <Listbox.Option
                            key="all"
                            value={null}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                          >
                            <span className="block truncate">Tất cả</span>
                          </Listbox.Option>
                          {filteredSubcategories.map((subcat) => (
                            <Listbox.Option
                              key={subcat.subcategory_id}
                              value={subcat.subcategory_id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                            >
                              {({ selected }) => (
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {subcat.subcategory_name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá tối thiểu
              </label>
              <ReactStars
                count={5}
                size={30}
                activeColor="#2563eb"
                value={tempFilters.rating}
                isHalf={false}
                onChange={(newRating) => updateTempFilter("rating", newRating)}
              />
            </div>

            {/* Sort */}
            <div>
              <Listbox
                value={tempFilters.sort}
                onChange={(val) => updateTempFilter("sort", val)}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Sắp xếp
                    </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span className="block truncate">
                          {tempFilters.sort.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {sortOptions.map((opt) => (
                            <Listbox.Option
                              key={opt.value}
                              value={opt}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                            >
                              {({ selected }) => (
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {opt.name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            {/* Apply button desktop */}
            <div className="mt-6">
              <button
                onClick={applyFilters}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                Áp dụng
              </button>
            </div>
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
