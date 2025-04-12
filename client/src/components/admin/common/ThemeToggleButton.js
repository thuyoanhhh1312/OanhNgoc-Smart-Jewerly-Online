import React from "react";
import { useTheme } from "./../../../context/ThemeContext"; // Đảm bảo sử dụng useTheme đúng cách

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme(); // Lấy theme và toggleTheme từ context

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      Switch to {theme === "light" ? "dark" : "light"} mode
    </button>
  );
};

export default ThemeToggleButton;
