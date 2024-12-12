import React, { useState, useEffect } from "react";
import TnosIndex from "../../components/TnosIndex";
import Preloader from "../../components/Preloader";

export default () => {
  const [getData, setData] = useState();

  useEffect(() => {
    const fetchData = async (statusList, currentIndex, groupedData) => {
      if (currentIndex >= statusList.length) {
        // Mengambil Semua Data Chat
        groupedData.forEach((item) => {
          groupedData.push({
            type: 1,
            created_at: item.created_at,
          });
        });

        setData(groupedData);
        return;
      }

      const status = statusList[currentIndex];
      try {
        const res = await fetch(
          `${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/${status}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();

        const statusData = data.data;
        statusData.forEach((item) => {
          groupedData.push({
            type: currentIndex + 2,
            created_at: item.tconsult_createat,
          });
        });

        fetchData(statusList, currentIndex + 1, groupedData);
      } catch (err) {
        console.log(err);
      }
    };

    const statusList = ["W", "A", "Y", "N"];
    fetchData(statusList, 0, []);
  }, []);

  return (
    <>
      <Preloader show={!getData ? true : false} />
      <TnosIndex
        suffix="people"
        dataProps={getData}
        dateName="created_at"
        priceName={false}
        status={{
          name: "type",
          datas: [
            {
              id: 1,
              name: "Chat Masuk",
              color: "#434D77",
              code: [1],
            },
            {
              id: 2,
              name: "Menunggu",
              color: "#F05432",
              code: [2],
            },
            {
              id: 3,
              name: "Terjawab",
              color: "#F5B759",
              code: [3],
            },
            {
              id: 4,
              name: "Disetujui",
              color: "#05A677",
              code: [4],
            },
            {
              id: 5,
              name: "Spam",
              color: "#D21A1A",
              code: [5],
            },
          ],
        }}
      />
    </>
  );
};
