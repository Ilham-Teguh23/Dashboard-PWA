import React, { useState, useEffect } from "react";
import TnosIndex from "../../components/TnosIndex";
import Preloader from "../../components/Preloader";

export default () => {
    const [getOrderData, setOrderData] = useState();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
            method: "POST",
            body: JSON.stringify({ category: "1" }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                let guardData = data.data;
                fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
                    method: "POST",
                    body: JSON.stringify({ category: "2" }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        let lawyerData = data.data;
                        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                let memberData = data.data;

                                let groupedData = [];

                                guardData.forEach((item) => {
                                    groupedData.push({
                                        type: 1,
                                        created_at: item.mmit_date_insert,
                                    });
                                });
                                lawyerData.forEach((item) => {
                                    groupedData.push({
                                        type: 2,
                                        created_at: item.mmit_date_insert,
                                    });
                                });
                                memberData.forEach((item) => {
                                    groupedData.push({
                                        type: 3,
                                        created_at: item.mmbr_date_insert,
                                    });
                                });

                                setOrderData(groupedData);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <>
            <Preloader show={!getOrderData ? true : false} />
            <TnosIndex
                suffix="people"
                dataProps={getOrderData}
                dateName="created_at"
                priceName={false}
                status={{
                    name: "type",
                    datas: [
                        {
                            id: 1,
                            name: "Pengamanan",
                            color: "#F05432",
                            code: [1],
                        },
                        {
                            id: 2,
                            name: "Pengacara",
                            color: "#88C541",
                            code: [2],
                        },
                        {
                            id: 3,
                            name: "Pengguna",
                            color: "#E5BE23",
                            code: [3],
                        },
                    ],
                }}
            />
        </>
    );
};
