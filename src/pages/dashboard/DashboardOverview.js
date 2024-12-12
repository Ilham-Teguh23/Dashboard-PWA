import React, { useState, useEffect } from "react";
import TnosIndex from "../../components/TnosIndex";
import Preloader from "../../components/Preloader";
import { InputGroup, Form } from "@themesberg/react-bootstrap";

export default () => {
    const [getSelectedData, setSelectedData] = useState(1);
    const [getOrderData, setOrderData] = useState();
    const [getPaymentData, setPaymentData] = useState();
    const [getPartnerMemberData, setPartnerMemberData] = useState();
    const [getConsultationChatData, setConsultationChatData] = useState();

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

                setPaymentData(datasUpdate);
            })
            .catch((err) => {
                console.log(err);
            });

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

                                setPartnerMemberData(groupedData);
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

        const fetchData = async (statusList, currentIndex, groupedData) => {
            if (currentIndex >= statusList.length) {
                // Mengambil Semua Data Chat
                groupedData.forEach((item) => {
                    groupedData.push({
                        type: 1,
                        created_at: item.created_at,
                    });
                });

                setConsultationChatData(groupedData);
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
            <Preloader show={!getOrderData ? true : false} />
            <InputGroup
                className="d-flex justify-content-center mb-2"
                style={{ width: "fit-content" }}
            >
                <InputGroup.Text>Menu</InputGroup.Text>
                <Form.Select
                    onChange={(e) => setSelectedData(parseInt(e.target.value))}
                >
                    <option value="1">Pemesanan</option>
                    <option value="2">Pembayaran</option>
                    <option value="3">Mitra & Pengguna</option>
                    <option value="4">Chat Konsultasi Gratis</option>
                </Form.Select>
            </InputGroup>

            {getSelectedData === 1 ? (
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
            ) : getSelectedData === 2 ? (
                <TnosIndex
                    suffix="payment"
                    dataProps={getPaymentData}
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
            ) : getSelectedData === 3 ? (
                <TnosIndex
                    suffix="people"
                    dataProps={getPartnerMemberData}
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
            ) : getSelectedData === 4 ? (
                <TnosIndex
                    suffix="people"
                    dataProps={getConsultationChatData}
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
            ) : (
                ""
            )}
        </>
    );
};
