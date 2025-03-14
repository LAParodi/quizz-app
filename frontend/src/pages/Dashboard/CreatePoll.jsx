import toast from "react-hot-toast";
import { useContext, useState } from "react";

import { POLL_TYPE } from "../../utils/data";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

import useUserAuth from "../../hooks/useUserAuth";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import OptionInput from "../../components/input/OptionInput";
import DashboardLayout from "../../components/layout/DashaboardLayout";
import OptionImageSelector from "../../components/input/OptionImageSelector";

const CreatePoll = () => {
  useUserAuth();

  const { user, onPollCreateOrDelete } = useContext(UserContext);

  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOptions: [],

    error: "",
  });

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imageOptions: [],

      error: "",
    });
  };

  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file);
        return imgUploadRes.imageUrl || "";
      } catch (error) {
        toast.error(`Error al subir imagen: ${imageOption.file}`);
        return "";
      }
    });

    const optionArr = await Promise.all(optionPromises);
    return optionArr;
  };

  const getOptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options;
      case "image-based":
        const options = await updateImageAndGetLink(pollData.imageOptions);
        return options;
      default:
        return [];
    }
  };

  const handleCreatePoll = async () => {
    const { question, type, options, imageOptions, error } = pollData;

    if (!question || !type) {
      console.log("Crear:", { question, type, options, error });
      handleValueChange("error", "Pregunta y Tipo de encuesta son requeridos.");
      return;
    }

    if (type === "single-choice" && options.length < 2) {
      handleValueChange("error", "Debes ingresar al menos 2 opciones.");
      return;
    }

    if (type === "image-based" && imageOptions.length < 2) {
      handleValueChange("error", "Debes ingresar al menos 2 opciones.");
      return;
    }

    const optionData = await getOptions();

    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionData,
        creatorId: user._id,
      });

      if (response) {
        onPollCreateOrDelete("create");
        toast.success("Encuesta creada.");
      }
    } catch (error) {
      console.error("Error en la creación de la encuesta:", error);
      if (error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
        handleValueChange("error", error.response.data.message);
      } else {
        toast.error("Algo salió mal. Inténtelo de nuevo.");
        handleValueChange("error", "Algo salió mal. Inténtelo de nuevo.");
      }
    } finally {
      clearData();
    }
  };

  return (
    <DashboardLayout activeMenu={"Crear encuesta"}>
      <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
        <h2 className="text-lg text-black font-medium">Crear encuesta</h2>

        <div className="mt-3">
          <label
            htmlFor="question"
            className="text-xs font-medium text-neutral-600"
          >
            Pregunta
          </label>

          <textarea
            id="question"
            placeholder="¿Qué estás pensando?"
            className="w-full text-[13px] text-black outline-none bg-neutral-200/80 p-2 rounded-md mt-2 resize-none"
            rows={4}
            value={pollData.question}
            onChange={({ target }) =>
              handleValueChange("question", target.value)
            }
          />
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-neutral-600">
            Tipo de encuesta
          </label>

          <div className="flex gap-4 flex-wrap mt-3">
            {POLL_TYPE.map((item) => (
              <div
                key={item.value}
                className={`option-chip ${
                  pollData.type === item.value
                    ? "text-white bg-neutral-900 border-white"
                    : "border-gray-500"
                }`}
                onClick={() => {
                  handleValueChange("type", item.value);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label htmlFor="option" className="text-xs font-medium text-neutral-600">
              Opciones
            </label>

            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => {
                  handleValueChange("options", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-neutral-600">
              Opciones
            </label>

            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value) => {
                  handleValueChange("imageOptions", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {pollData.error}
          </p>
        )}

        <button className="btn-primary py-2 mt-6" onClick={handleCreatePoll}>
          Crear encuesta
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
