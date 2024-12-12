import moment from "moment/moment";

export default (timestamp, type) => {
  let result = "";

  moment.locale("id");
  let dateFormat = type === "shortMonth" ? "DD MMM YYYY" : "DD-MM-YYYY";
  result = moment(timestamp).format(dateFormat + " HH:mm:ss");

  return result;
};
