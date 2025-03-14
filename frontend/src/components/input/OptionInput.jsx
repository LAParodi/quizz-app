import { useState } from "react";
import { HiMiniPlus } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi";

const OptionInput = ({ optionList, setOptionList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updateArr = optionList.filter((_, idx) => idx !== index);
    setOptionList(updateArr);
  };

  return (
    <>
      {optionList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-neutral-200/80 px-4 py-2 rounded-md mb-3"
        >
          <p className="text-xs font-medium text-black">{item}</p>

          <button
            className=""
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-rose-500 cursor-pointer" />
          </button>
        </div>
      ))}

      {optionList.length < 4 && (
        <div className="flex items-center gap-5 mt-4">
          <input
            id="option"
            name="option"
            type="text"
            placeholder="Ingresa una opción"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-neutral-200/80 px-3 py-[6px] rounded-md"
          />

          <button
            className="btn-small text-nowrap py-[6px]"
            onClick={handleAddOption}
          >
            <HiMiniPlus className="text-lg" />
            Añadir opción
          </button>
        </div>
      )}
    </>
  );
};

export default OptionInput;
