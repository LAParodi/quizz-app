import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfileImageSelector = ({ image, setImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      setImage(imageFile);

      const preview = URL.createObjectURL(imageFile);
      setPreviewUrl(preview);
    }
  };

  const handleRevomeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    imageRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        ref={imageRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full relative">
          <LuUser className="text-4xl text-gray-500" />

          <button
            type="button"
            className="btn-uploadImg"
            onClick={onChooseFile}
          >
            <LuUpload className="text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt={"Avatar"}
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            type="button"
            className="btn-deleteImg"
            onClick={handleRevomeImage}
          >
            <LuTrash className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageSelector;
