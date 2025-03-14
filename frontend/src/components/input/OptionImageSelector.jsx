import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }) => {
  const handleAddImage = (event) => {
    const file = event.target.files[0];

    if (file && imageList.length < 4) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageList([...imageList, { base64: reader.result, file }]);
      };
      reader.readAsDataURL(file);
      event.target.value = null;
    }
  };

  const handleDeleteImage = (index) => {
    const updatedList = imageList.filter((_, idx) => idx !== index);
    setImageList(updatedList);
  };

  return (
    <>
      {imageList.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {imageList.map((item, index) => (
            <div key={index} className="bg-neutral-600/10 rounded-md relative">
              <img
                src={item.base64}
                alt={`Seleccionado ${index}`}
                className="w-full h-36 object-contain rounded-md"
              />

              <button
                onClick={() => handleDeleteImage(index)}
                className="text-red-500 bg-slate-100 rounded-full p-2 absolute top-2 right-2"
              >
                <HiOutlineTrash className="text-xl cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      )}

      {imageList.length < 4 && (
        <div className="flex items-center gap-5">
          <input
            name="imageInput"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleAddImage}
            className="hidden"
            id="imageInput"
          />
          <label htmlFor="imageInput" className="btn-small text-nowrap py-1">
            <HiMiniPlus className="text-lg cursor-pointer" />
            Añadir imagen
          </label>
        </div>
      )}
    </>
  );
};

export default OptionImageSelector;
