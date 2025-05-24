import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import QuickSearchPopup from "../../QuickSearchPopup";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [openQuickSearch, setOpenQuickSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách category:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/product-by-category/${encodeURIComponent(categoryName)}`);
  };

  const handlePromotionClick = () => {
    navigate("/promotions");
  };

  const handleSearch = (keyword) => {
    if (keyword) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header id="siteHeader" className="w-full relative z-20">
      <div className="xl:flex hidden items-center justify-center mx-auto mb-[2px] max-w-[1920px] h-[45px]">
        <nav className="headerMenu font-['Robotolight'] flex justify-between w-[700px] relative hidden xl:flex">
          {/* Menu Trang Sức */}
          <div className="menuItem group cursor-pointer py-2 relative">
            <a className="inline-flex items-center text-[18px] font-normal relative group-hover:text-[#c48c46] text-[#000]">
              Trang Sức
            </a>
            <div className="megaMenu w-[150px] shadow-header bg-[#fff] absolute ltr:-left-[50%] rtl:-right-20 ltr:xl:left-[0%] rtl:xl:right-[50%] opacity-0 invisible group-hover:opacity-100 group-hover:visible p-6 flex justify-between max-h-[400px] overflow-y-auto">
              <div>
                <h3 className="font-bold mb-3">Chủng loại</h3>
                {loadingCategories ? (
                  <div>Đang tải danh mục...</div>
                ) : (
                  <ul>
                    {categories.length === 0 && <li>Chưa có danh mục nào</li>}
                    {categories.map((cat) => (
                      <li
                        key={cat.id || cat.category_id}
                        className="mb-2 cursor-pointer"
                        onClick={() => handleCategoryClick(cat.category_name)}
                      >
                        <span className="text-[#000000] text-[14px] hover:text-yellow-500 block">
                          {cat.category_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Menu Khuyến Mãi */}
          <div className="menuItem cursor-pointer py-2" onClick={handlePromotionClick}>
            <a className="inline-flex items-center text-[18px] font-normal relative text-[#ac2b36]">
              Khuyến Mãi
            </a>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="relative h-[35px] w-[360px] mt-[3px]">
            <button
              className="w-full h-[35px] rounded-[100px] pl-[14px] italic bg-[#ededed] leading-[35px] text-left text-gray-700 outline-none border-2 border-solid hover:border-yellow-500 transition"
              style={{ border: "2px solid #ededed" }}
              onClick={() => setOpenQuickSearch(true)}
            >
              <span style={{ color: "#888" }}>Tìm kiếm nhanh</span>
              <img
                alt="Tìm kiếm nhanh"
                loading="lazy"
                width="16"
                height="16"
                src="https://cdn.pnj.io/images/image-update/layout/mobile/find-icon.svg"
                style={{ position: "absolute", right: 20, top: 10 }}
              />
            </button>
            <QuickSearchPopup
              open={openQuickSearch}
              onClose={() => setOpenQuickSearch(false)}
              onSearch={handleSearch}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
