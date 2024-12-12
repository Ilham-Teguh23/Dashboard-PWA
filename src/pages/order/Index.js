import React, { useState, useEffect } from "react";
import TnosIndex from "../../components/TnosIndex";
import Preloader from "../../components/Preloader";

export default () => {
  const [getOrderData, setOrderData] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let datas = data.data.filter(
          (item) =>
            item.status === 1 ||
            item.status === 2 ||
            item.status === 3 ||
            item.status === 990 ||
            item.status === 999 ||
            item.status === 1001
        );
        setOrderData(datas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Preloader show={!getOrderData ? true : false} />
      <TnosIndex
        suffix="order"
        dataProps={getOrderData}
        dateName="date_insert"
        priceName="price"
        status={{
          name: "status",
          datas: [
            {
              id: 1,
              name: "Penugasan",
              color: "#262B40",
              code: [1, 2, 3, 990],
            },
            {
              id: 2,
              name: "Selesai",
              color: "#05A677",
              code: [999],
            },
            {
              id: 3,
              name: "Dibatalkan",
              color: "#FA5252",
              code: [1001],
            },
          ],
        }}
      />
    </>
  );
};
