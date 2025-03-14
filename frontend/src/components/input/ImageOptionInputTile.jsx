const ImageOptionInputTile = ({ isSelected, imgUrl, onSelect }) => {
  const getColors = () => {
    if (isSelected) return "border-2 border-neutral-500";

    return "border-transparent";
  };

  return (
    <button
      className={`cursor-pointer w-full flex items-center gap-2 mb-4 rounded-md bg-slate-200/40 overflow-hidden ${getColors()}`}
      onClick={onSelect}
    >
      <img src={imgUrl} alt="" className="w-full h-36 object-contain" />
    </button>
  );
};

export default ImageOptionInputTile;
