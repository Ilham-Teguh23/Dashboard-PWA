import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default (msg, type = "success") => {
  if (type === "error") {
    toast.error(msg);
  } else if (type === "info") {
    toast.info(msg);
  } else {
    toast.success(msg);
  }
};
