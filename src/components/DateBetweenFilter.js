export default (data, dateName, startDate, endDate) => {
  return data.filter(
    (item) =>
      new Date(item[dateName]).getTime() >= new Date(startDate).getTime() &&
      new Date(item[dateName]).getTime() <= new Date(endDate).getTime()
  );
};
