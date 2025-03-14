import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const AuthInput = ({ id, type, value, label, placeholder, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-xs text-gray-800">
        {label}
      </label>

      <div className="input-box">
        <input
          id={id}
          type={
            type == "password" ? (showPassword ? "text" : "password") : "text"
          }
          value={value}
          autoComplete={"true"}
          placeholder={placeholder}
          onChange={(e) => onChange(e)}
          className="w-full bg-transparent outline-none"
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-gray-500 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-gray-500 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
