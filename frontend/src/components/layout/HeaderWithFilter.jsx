import { useState } from "react";
import { IoCloseOutline, IoFilterOutline } from "react-icons/io5";

import { POLL_TYPE } from "../../utils/data";

const HeaderWithFilter = ({ title, filterType, setFilterType }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="sm:text-xl font-medium text-neutral-800">{title}</h2>

        <button
          className={`flex items-center gap-3 text-sm text-white bg-neutral-800 px-4 py-2 cursor-pointer ${
            open ? "rounded-t-lg" : "rounded-lg"
          }`}
          onClick={() => {
            if (filterType !== "") setFilterType("");
            setOpen(!open);
          }}
        >
          {filterType !== "" ? (
            <>
              <IoCloseOutline className="text-xl" />
              Sin filtros
            </>
          ) : (
            <>
              <IoFilterOutline className="text-xl" />
              Filtrar
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-wrap gap-4 bg-neutral-800 p-4 rounded-l-lg rounded-b-lg">
          {[{ label: "Todos", value: "" }, ...POLL_TYPE].map((type) => (
            <button
              key={type.value}
              className={`cursor-pointer text-[12px] px-4 py-1 rounded-lg text-nowrap ${
                filterType == type.value
                  ? "text-white bg-neutral-700"
                  : "text-[13px] bg-slate-100"
              }`}
              onClick={() => {
                setFilterType(type.value);
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderWithFilter;
