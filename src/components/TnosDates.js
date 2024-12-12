export const TnosDatesYear = (from) => {
  return new Array(new Date().getFullYear() + 1 - from)
    .fill()
    .map((d, i) => i + from);
};

export const TnosDatesMonth = () => {
  return [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
};

export const TnosDatesHours = () => {
  return [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
};

export const TnosDatesNumDays = (lastDay) => {
  let daysMonths = [];
  for (let i = 1; i <= lastDay; i++) {
    daysMonths.push(i.toString());
  }
  return daysMonths;
};

export const TnosDatesNumMonths = () => {
  let month = [];
  for (let i = 1; i <= 12; i++) {
    month.push(i.toString());
  }
  return month;
};

export const TodayDates = (type) => {
  let date = new Date();
  if (type === "date") {
    return date;
  } else if (type === "month") {
    return date.getMonth() < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  } else if (type === "year") {
    return date.getFullYear();
  }
};
