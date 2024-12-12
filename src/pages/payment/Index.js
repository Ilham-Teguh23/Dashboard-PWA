import React, { useState, useEffect } from "react";
import TnosIndex from "../../components/TnosIndex";
import Preloader from "../../components/Preloader";

export default () => {
  const [getOrderData, setOrderData] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let datas = data.data.filter(
          (item) =>
            item.transaction_status === "capture" ||
            item.transaction_status === "settlement" ||
            item.transaction_status === "pending" ||
            item.transaction_status === "deny" ||
            item.transaction_status === "cancel" ||
            item.transaction_status === "expire" ||
            item.transaction_status === "refund" ||
            item.transaction_status === "partial_refund"
        );
        const changeStatusToInt = (status) => {
          if (status === "capture") {
            return 1;
          } else if (status === "settlement") {
            return 2;
          } else if (status === "pending") {
            return 3;
          } else if (status === "deny") {
            return 4;
          } else if (status === "cancel") {
            return 5;
          } else if (status === "expire") {
            return 6;
          } else if (status === "refund") {
            return 7;
          } else if (status === "partial_refund") {
            return 8;
          }
        };

        let datasUpdate = datas.map((item) => {
          return {
            ...item,
            transaction_status: changeStatusToInt(item.transaction_status),
          };
        });

        setOrderData(datasUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Preloader show={!getOrderData ? true : false} />
      <TnosIndex
        suffix="payment"
        dataProps={getOrderData}
        dateName="transaction_time"
        priceName="gross_amount"
        status={{
          name: "transaction_status",
          datas: [
            {
              id: 1,
              name: "Capture",
              color: "#05A677",
              code: [1],
            },
            {
              id: 2,
              name: "Settlement",
              color: "#05A677",
              code: [2],
            },
            {
              id: 3,
              name: "Pending",
              color: "#FA5252",
              code: [3],
            },
            {
              id: 4,
              name: "Deny",
              color: "#FA5252",
              code: [4],
            },
            {
              id: 5,
              name: "Cancel",
              color: "#FA5252",
              code: [5],
            },
            {
              id: 6,
              name: "Expire",
              color: "#FA5252",
              code: [6],
            },
            {
              id: 7,
              name: "Refund",
              color: "#262B40",
              code: [7],
            },
            {
              id: 8,
              name: "Partial Refund",
              color: "#262B40",
              code: [8],
            },
          ],
        }}
      />
    </>
  );
};
