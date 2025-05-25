import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol
        className="flex justify-center items-center text-[24px]  text-gray-800"
        style={{ gap: "8px" }}
      >
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.to ? (
              <Link to={item.to} className="hover:text-blue-600">
                {item.label}
              </Link>
            ) : (
              <span className="font-bold">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-[20px] ">{"/"}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
