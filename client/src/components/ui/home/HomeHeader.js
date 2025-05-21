import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuData = [
  {
    title: "Trang Sức",
    submenu: {
      "Chủng loại": [
        "Bông tai",
        "Mặt dây chuyền",
        "Lắc - Vòng tay",
        "Dây chuyền",
        "Nhẫn",
        "Charm",
        "Dây cổ",
      ],
      "Chất liệu": ["Vàng", "Bạc"],
    },
  },
  { title: "Khuyến Mãi", className: "text-[#ac2b36]" },
];

const Header = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <header id="siteHeader" className="w-full relative z-20">
      <div className="xl:flex hidden items-center justify-center mx-auto mb-[2px] max-w-[1920px] h-[45px]">
        <nav className="headerMenu font-['Robotolight'] flex justify-between w-[700px] relative hidden xl:flex">
          {menuData.map((item, idx) => (
            <div key={idx} className="menuItem group cursor-pointer py-2">
              <a
                className={`inline-flex items-center text-[18px] font-normal relative group-hover:text-[#c48c46] ${
                  item.className || "text-[#000]"
                }`}
              >
                {item.title}
              </a>
              {item.submenu && (
                <div className="megaMenu w-[300px] shadow-header bg-[#fff] absolute ltr:-left-[50%] rtl:-right-20 ltr:xl:left-[0%] rtl:xl:right-[50%] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <div className="flex justify-between px-[45px]">
                    {Object.entries(item.submenu).map(
                      ([subTitle, items], i) => (
                        <ul key={i} className="pb-[25px] pt-6">
                          <li className="mb-1.5">
                            <a className="block text-[16px] pb-[2px] mb-[5px] font-body hover:text-yellow-500 font-bold">
                              {subTitle}
                            </a>
                          </li>
                          {items.map((subItem, j) => (
                            <li key={j}>
                              <a className="text-[#000000] text-[14px] pb-[2px] mb-[5px] hover:text-yellow-500 flex items-center">
                                {subItem}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="relative h-[35px] w-[360px] mt-[3px]">
            <input
              type="text"
              className="border-2 border-solid h-[35px] w-full rounded-[100px] pl-[10px] italic bg-[#ededed] leading-[35px] outline-none"
              placeholder={"Tìm kiếm nhanh"}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute top-[10px] right-3 bg-[#ededed] pointer-events-none">
              <img
                alt={"Tìm kiếm nhanh"}
                loading="lazy"
                width="14.5"
                height="15"
                src="https://cdn.pnj.io/images/image-update/layout/mobile/find-icon.svg"
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
