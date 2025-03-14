import moment from "moment";
import "moment/locale/es";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getPollBookmarked = (userBookmarks = [], pollId) => {
  return userBookmarks.includes(pollId);
};

export const convertDate = (date, fromNow) => {
  moment.updateLocale("es", {
    months:
      "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
        "_"
      ),
    monthsShort:
      "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split("_"),
    weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"),
    weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
    weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
    longDateFormat: {
      LT: "h:mm A",
      LTS: "h:mm:ss A",
      L: "DD/MM/YYYY",
      LL: "D de MMMM de YYYY",
      LLL: "D de MMMM de YYYY h:mm A",
      LLLL: "dddd, D de MMMM de YYYY h:mm A",
    },
    meridiemParse: /AM|PM/,
    meridiem: function (hours, minutes, isLower) {
      return hours < 12 ? "AM" : "PM";
    },
    calendar: {
      sameDay: "[Hoy a las] LT",
      nextDay: "[Mañana a las] LT",
      nextWeek: "dddd [a las] LT",
      lastDay: "[Ayer a las] LT",
      lastWeek: "dddd [pasado] [a las] LT",
      sameElse: "L",
    },
    relativeTime: {
      future: "en %s",
      past: "hace %s",
      s: "segundos",
      m: "un minuto",
      mm: "%d minutos",
      h: "una hora",
      hh: "%d horas",
      d: "un día",
      dd: "%d días",
      M: "un mes",
      MM: "%d meses",
      y: "un año",
      yy: "%d años",
    },
  });

  let fechaRelativa;

  fromNow
    ? (fechaRelativa = moment(date).format("DD MMMM YYYY, HH:mm"))
    : (fechaRelativa = moment(date).fromNow());

  return fechaRelativa;
};
