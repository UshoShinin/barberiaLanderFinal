export let getMonthChart = (month) => {
  let monthChart;
  switch (month) {
    case 1:
    case 10:
      monthChart = 0;
      break;
    case 5:
      monthChart = 1;
      break;
    case 8:
      monthChart = 2;
      break;
    case 2:
    case 3:
    case 11:
      monthChart = 3;
      break;
    case 6:
      monthChart = 4;
      break;
    case 9:
    case 12:
      monthChart = 5;
      break;
    case 4:
    case 7:
      monthChart = 6;
      break;
    default:
      break;
  }
  return monthChart;
};

export const getDayIndex = (diaActual, monthChart, yearChart, shortYear) => {
  let dayIndex =
    diaActual + monthChart + yearChart + shortYear + Math.trunc(shortYear / 4);
  dayIndex = dayIndex % 7;
  dayIndex = dayIndex === 0 ? 7 : dayIndex;
  return dayIndex;
};

export let getMonthValue = (index, year) => {
  switch (index) {
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return year % 4 === 0 ? 29 : 28;
    default:
      return 31;
  }
};

export const getDayIndex2 = (diaActual, mes, year) => {
  let monthChart = getMonthChart(mes);
  let yearChart = 6;
  let shortYear = parseInt(year.toString().substr(-2), 10)
  let dayIndex =
    diaActual + monthChart + yearChart + shortYear + Math.trunc(shortYear / 4);
  dayIndex = dayIndex % 7;
  dayIndex = dayIndex === 0 ? 7 : dayIndex;
  return dayIndex;
};
