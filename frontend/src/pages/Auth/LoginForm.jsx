import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_PATHS } from "../../utils/apiPaths";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/UserContext";

import axiosInstance from "../../utils/axiosInstance";
import AuthInput from "../../components/input/AuthInput";
import AuthLayout from "../../components/layout/AuthLayout";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage("Formato de correo electrónico inválido.");
      return;
    }

    if (!password) {
      setErrorMessage("Debes ingresar una contraseña.");
      return;
    }

    setErrorMessage("");

    // Login API
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
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
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Bienvenido</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Ingresa tus credenciales para ingresar
        </p>

        <form onSubmit={handleLogin}>
          <AuthInput
            id={"email"}
            type={"text"}
            value={email}
            label={"Correo electrónico"}
            placeholder={"laparodi.dev@gmail.com"}
            onChange={({ target }) => setEmail(target.value.toLowerCase())}
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

          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>

          <p className="text-xs text-slate-800 mt-3">
            ¿Deseas crear una cuenta?
            <Link
              className="font-medium underline text-neutral-500 hover:text-neutral-400"
              to={"/signup"}
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
