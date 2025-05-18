import React from "react";

const CountWithControls = ({ quantity, onIncrease, onDecrease, min = 1 }) => {
  return (
    <div className="flex items-center border rounded w-max">
      <button
        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
        onClick={() => onDecrease()}
        disabled={quantity <= min}
      >
        -
      </button>
      <input
        type="text"
        className="w-12 text-center border-x"
        value={quantity}
        readOnly
      />
      <button
        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
        onClick={() => onIncrease()}
      >
        +
      </button>
    </div>
  );
};

export default CountWithControls;
