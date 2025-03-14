import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { API_PATHS } from "../utils/apiPaths";

import axiosInstance from "../utils/axiosInstance";

const useUserAuth = () => {
  const navigate = useNavigate();

  const { user, updateUser, clearUser } = useContext(UserContext);

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.log("Hubo un error: ", error);

        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser]);
};

export default useUserAuth;
