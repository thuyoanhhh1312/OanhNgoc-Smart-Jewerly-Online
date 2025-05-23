import React from "react";

const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <label className={`switch ${disabled ? "switch-disabled" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="slider round"></span>
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: background-color 0.3s ease;
          border-radius: 14px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 2px;
          bottom: 2px;
          background-color: #fff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        input:checked + .slider {
          background-color: #14b8a6; /* màu xanh PNJ */
          box-shadow: inset 0 0 8px rgba(20, 184, 166, 0.7);
        }
        input:checked + .slider:before {
          transform: translateX(24px);
          box-shadow: 0 3px 8px rgba(20, 184, 166, 0.7);
        }
        .switch:hover:not(.switch-disabled) .slider {
          box-shadow: inset 0 0 10px rgba(20, 184, 166, 0.6);
        }
        .switch-disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </label>
  );
};

export default ToggleSwitch;
