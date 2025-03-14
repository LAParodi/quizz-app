import {
  LuLayoutDashboard,
  LuVote,
  LuPenTool,
  LuBadgeCheck,
  LuBookmark,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Crear encuesta",
    icon: LuVote,
    path: "/create-poll",
  },
  {
    id: "03",
    label: "Mis encuestas",
    icon: LuPenTool,
    path: "/my-polls",
  },
  {
    id: "04",
    label: "Respondidas",
    icon: LuBadgeCheck,
    path: "/voted-polls",
  },
  {
    id: "05",
    label: "Favoritos",
    icon: LuBookmark,
    path: "/bookmarked-polls",
  },
  {
    id: "06",
    label: "Cerrar sesión",
    icon: LuLogOut,
    path: "logout",
  },
];

export const POLL_TYPE = [
  {
    id: "01",
    label: "Sí/No",
    value: "yes/no",
  },
  {
    id: "02",
    label: "Elección única",
    value: "single-choice",
  },
  {
    id: "03",
    label: "Rating",
    value: "rating",
  },
  {
    id: "04",
    label: "Banco de imágenes",
    value: "image-based",
  },
  {
    id: "05",
    label: "Respuesta única",
    value: "open-ended",
  },
];
