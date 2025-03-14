import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_PATHS } from "../../utils/apiPaths";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/UserContext";

import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import AuthInput from "../../components/input/AuthInput";
import AuthLayout from "../../components/layout/AuthLayout";
import ProfileImageSelector from "../../components/input/ProfileImageSelector";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!validateEmail(email)) {
      setErrorMessage("Formato de correo electrónico inválido.");
      return;
    }

    if (!username) {
      setErrorMessage("Debes ingresar un nombre de usuario.");
      return;
    }

    if (!password) {
      setErrorMessage("Debes ingresar una contraseña.");
      return;
    }

    if (!fullName) {
      setErrorMessage("Debes ingresar al menos un nombre y un apellido.");
      return;
    }

    setErrorMessage("");

    // SignUp API
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        username,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Algo salió mal. Inténtelo de nuevo.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Crea una cuenta</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Crea y responder cuestionarios interactivos.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfileImageSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              id={"fullName"}
              type={"text"}
              value={fullName}
              label={"Nombre(s) y apellido(s)"}
              placeholder={"Luigui A. Parodi Rivas"}
              onChange={({ target }) => setFullName(target.value)}
            />

            <AuthInput
              id={"username"}
              type={"text"}
              value={username}
              label={"Nombre de usuario"}
              placeholder={"@luiguiparodidev"}
              onChange={({ target }) => setUsername(target.value)}
            />

            <AuthInput
              id={"email"}
              type={"text"}
              value={email}
              label={"Correo electrónico"}
              placeholder={"laparodi.dev@gmail.com"}
              onChange={({ target }) => setEmail(target.value)}
            />

            <AuthInput
              id={"password"}
              type="password"
              value={password}
              label={"Contraseña"}
              placeholder={"Introduce tu contraseña"}
              onChange={({ target }) => setPassword(target.value)}
            />

            {errorMessage && (
              <p className="text-red-500 text-xs pb-2.5">{errorMessage}</p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Crear cuenta
          </button>

          <p className="text-xs text-slate-800 mt-3">
            ¿Ya tienes una cuenta?{" "}
            <Link
              className="font-medium underline text-neutral-500 hover:text-neutral-400"
              to={"/login"}
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUpForm;
