import React, { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faThList,
    faLongArrowAltUp,
    faFileExcel,
    faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Row,
    Button,
    Form,
    InputGroup,
    Badge,
    Tooltip,
    OverlayTrigger,
    Tab,
    Nav,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import Preloader from "../../components/Preloader";

export default () => {
    // Transaction
    const [getTransactionData, setTransactionData] = useState();
    const [getAllTransactionData, setAllTransactionData] = useState();
    const [getAllStatusTransactionData, setAllStatusTransactionData] = useState();
    const [getCaptureData, setCaptureData] = useState();
    const [getSettlementData, setSettlementData] = useState();
    const [getPendingData, setPendingData] = useState();
    const [getDenyData, setDenyData] = useState();
    const [getCancelData, setCancelData] = useState();
    const [getExpireData, setExpireData] = useState();
    const [getRefundData, setRefundData] = useState();
    const [getPartialRefundData, setPartialRefundData] = useState();
    const [getTotalAmountToday, setTotalAmountToday] = useState();
    const [getTotalAmountBetween, setTotalAmountBetween] = useState();
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    );
    const [getActiveStatus, setActiveStatus] = useState("all_status");

    // Income
    const [getIncomeData, setIncomeData] = useState();
    const [getAllIncomeData, setAllIncomeData] = useState();
    const [getEndingBalance, setEndingBalance] = useState();
    const [getTotalAmountTodayIncome, setTotalAmountTodayIncome] = useState();
    const [getTotalAmountBetweenIncome, setTotalAmountBetweenIncome] = useState();

    // ExcelFile
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const humanizeText = (str) => {
        var i,
            frags = str.split("_");
        for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(" ");
    };

    const TableRowTransaction = (props) => {
        const {
            order_id,
            order_id_master,
            order_status,
            payment_type,
            currency,
            gross_amount,
            invoice_price,
            cut_price,
            mitra_price,
            tnos_price,
            transaction_time,
            transaction_status,
        } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td>{order_id}</td>
                <td className="text-center">
                    {order_status.status === "Selesai" ||
                        order_status.status === "Dibatalkan" ||
                        order_status.status === "Penugasan" ||
                        order_status.status === "Sedang Berlangsung" ? (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Cek Pesanan</Tooltip>}
                        >
                            <Link
                                to={`/order/on-progress/detail`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Badge
                                    bg={order_status.status_color}
                                    className="badge-lg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        localStorage.setItem("orderIdMaster", order_id_master);
                                    }}
                                >
                                    {order_status.status}
                                </Badge>
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <Badge bg={order_status.status_color} className="badge-lg">
                            {order_status.status}
                        </Badge>
                    )}
                </td>
                <td>{humanizeText(payment_type)}</td>
                <td>
                    {currency + " " + parseInt(gross_amount).toLocaleString("id-ID", {})}
                </td>
                <td>
                    {order_status.status === "Selesai" ||
                        order_status.status === "Dibatalkan" ||
                        order_status.status === "Penugasan" ||
                        order_status.status === "Sedang Berlangsung"
                        ? currency +
                        " " +
                        parseInt(invoice_price).toLocaleString("id-ID", {})
                        : "Tidak Ada"}
                </td>
                <td>
                    {currency + " " + parseInt(cut_price).toLocaleString("id-ID", {})}
                </td>
                <td>
                    {currency + " " + parseInt(mitra_price).toLocaleString("id-ID", {})}
                </td>
                <td>
                    {currency + " " + parseInt(tnos_price).toLocaleString("id-ID", {})}
                </td>
                <td>
                    {transaction_time.split(" ")[0].split("-")[2] +
                        "-" +
                        transaction_time.split(" ")[0].split("-")[1] +
                        "-" +
                        transaction_time.split(" ")[0].split("-")[0] +
                        " " +
                        transaction_time.split(" ")[1]}
                </td>
                <td className="text-center">
                    <Badge
                        bg={
                            transaction_status === "capture"
                                ? "soft-green"
                                : transaction_status === "settlement"
                                    ? "soft-green"
                                    : transaction_status === "pending"
                                        ? "secondary"
                                        : transaction_status === "deny"
                                            ? "danger"
                                            : transaction_status === "cancel"
                                                ? "danger"
                                                : transaction_status === "expire"
                                                    ? "danger"
                                                    : transaction_status === "refund"
                                                        ? "blue"
                                                        : transaction_status === "partial_refund"
                                                            ? "blue"
                                                            : ""
                        }
                        className="badge-lg"
                    >
                        {transaction_status === "capture"
                            ? "Capture"
                            : transaction_status === "settlement"
                                ? "Settlement"
                                : transaction_status === "pending"
                                    ? "Pending"
                                    : transaction_status === "deny"
                                        ? "Deny"
                                        : transaction_status === "cancel"
                                            ? "Cancel"
                                            : transaction_status === "expire"
                                                ? "Expire"
                                                : transaction_status === "refund"
                                                    ? "Refund"
                                                    : transaction_status === "partial_refund"
                                                        ? "Partial Refund"
                                                        : ""}
                    </Badge>
                </td>
                <td className="text-center">
                    <Link
                        to={`/payment/transaction/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                localStorage.setItem("orderId", order_id);
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                            &nbsp; Detail
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    };

    const TableRowIncome = (props) => {
        const {
            order_id,
            trx_code,
            type,
            fee,
            saldo,
            create_at,
            create_by,
            order_id_master,
            order_status,
        } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td>{order_id}</td>
                <td>
                    {trx_code} &nbsp;
                    {fee === "0" && (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Pesanan ini menggunakan voucher</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    )}
                </td>
                <td className="text-center">
                    {order_status.status === "Selesai" ||
                        order_status.status === "Dibatalkan" ||
                        order_status.status === "Penugasan" ||
                        order_status.status === "Sedang Berlangsung" ? (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Cek Pesanan</Tooltip>}
                        >
                            <Link
                                to={`/order/on-progress/detail`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Badge
                                    bg={order_status.status_color}
                                    className="badge-lg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        localStorage.setItem("orderIdMaster", order_id_master);
                                    }}
                                >
                                    {order_status.status}
                                </Badge>
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <Badge bg={order_status.status_color} className="badge-lg">
                            {order_status.status}
                        </Badge>
                    )}
                </td>
                <td>{type}</td>
                <td className={fee !== "0" && "text-success fw-bold"}>
                    {"IDR " + parseInt(fee).toLocaleString("id-ID", {})}
                    &nbsp;
                    {fee !== "0" && "+"}
                </td>
                <td className={fee !== "0" && "text-success fw-bold"}>
                    {"IDR " + parseInt(saldo).toLocaleString("id-ID", {})}
                    &nbsp;
                    {fee !== "0" && <FontAwesomeIcon icon={faLongArrowAltUp} />}
                </td>
                <td>
                    {create_at.split("+")[0].split("T")[1] +
                        " " +
                        create_at.split("+")[0].split("T")[0].split("-")[2] +
                        "-" +
                        create_at.split("+")[0].split("T")[0].split("-")[1] +
                        "-" +
                        create_at.split("+")[0].split("T")[0].split("-")[0]}
                </td>
                <td>{!create_by || create_by === "undefined" ? "-" : create_by}</td>
            </tr>
        );
    };

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

    const getDataBetweenDate = (
        datas,
        startDate,
        endDate,
        type = "transaction"
    ) => {
        return type === "transaction"
            ? JSON.parse(datas).filter(
                (item) =>
                    new Date(item.transaction_time).getTime() >=
                    new Date(startDate).getTime() &&
                    new Date(item.transaction_time).getTime() <=
                    new Date(endDate).getTime()
            )
            : JSON.parse(datas).filter(
                (item) =>
                    new Date(
                        item.create_at.split("T")[0] +
                        " " +
                        item.create_at.split("T")[1].split("+")[0]
                    ).getTime() >= new Date(startDate).getTime() &&
                    new Date(
                        item.create_at.split("T")[0] +
                        " " +
                        item.create_at.split("T")[1].split("+")[0]
                    ).getTime() <= new Date(endDate).getTime()
            );
    }

    useEffect(() => {
        localStorage.setItem(
            "getStartDateTransaction",
            getTodayDate() + " 00:00:00"
        );
        localStorage.setItem("getEndDateTransaction", getTodayDate() + " 23:59:59");
        localStorage.setItem("getStartDateIncome", getTodayDate() + " 00:00:00");
        localStorage.setItem("getEndDateIncome", getTodayDate() + " 23:59:59");
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                let transactionApiData = data.data;
                fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        // Order
                        let orderApiData = data.data;

                        // Transaksi
                        let transactionOrderData = [];
                        transactionApiData.forEach((item) => {
                            JSON.stringify(
                                orderApiData.filter(
                                    (itemOrder) => itemOrder.sid !== item.order_id
                                )
                            ) === "[]" &&
                                transactionOrderData.push({
                                    ...item,
                                    order_id_master:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]" &&
                                        orderApiData.filter(
                                            (itemOrder) => itemOrder.sid === item.order_id
                                        )[0].id,
                                    order_status:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) === "[]"
                                            ? { status: "Tidak Ada", status_color: "gray" }
                                            : orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].status === 1
                                                ? { status: "Menerima Pesanan", status_color: "primary" }
                                                : orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].status === 2
                                                    ? { status: "Dalam Perjalanan", status_color: "primary" }
                                                    : orderApiData.filter(
                                                        (itemOrder) => itemOrder.sid === item.order_id
                                                    )[0].status === 3
                                                        ? {
                                                            status: "Hadir dan Sedang Bertugas",
                                                            status_color: "primary",
                                                        }
                                                        : orderApiData.filter(
                                                            (itemOrder) => itemOrder.sid === item.order_id
                                                        )[0].status === 990
                                                            ? { status: "Sedang Berlangsung", status_color: "blue" }
                                                            : orderApiData.filter(
                                                                (itemOrder) => itemOrder.sid === item.order_id
                                                            )[0].status === 999
                                                                ? { status: "Selesai", status_color: "success" }
                                                                : orderApiData.filter(
                                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                                )[0].status === 1001
                                                                    ? { status: "Dibatalkan", status_color: "danger" }
                                                                    : { status: "Tidak Ada", status_color: "gray" },
                                    invoice_price:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]" &&
                                        orderApiData.filter(
                                            (itemOrder) => itemOrder.sid === item.order_id
                                        )[0].price,
                                    mitrafee:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]"
                                            ? orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].mitraprice
                                            : 0,
                                    tnosfee:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]"
                                            ? orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].tnosfee
                                            : 0,
                                    cut_price:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]"
                                            ? orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].alasan_batal === "assLbl55"
                                                ? (10 / 100) *
                                                orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].price
                                                : 0
                                            : 0,
                                    mitra_price:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]"
                                            ? orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].status === 1001
                                                ? orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].alasan_batal === "assLbl55"
                                                    ? (80 / 100) *
                                                    ((10 / 100) *
                                                        orderApiData.filter(
                                                            (itemOrder) => itemOrder.sid === item.order_id
                                                        )[0].price)
                                                    : 0
                                                : orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].mitraprice
                                            : 0,
                                    tnos_price:
                                        JSON.stringify(
                                            orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )
                                        ) !== "[]"
                                            ? orderApiData.filter(
                                                (itemOrder) => itemOrder.sid === item.order_id
                                            )[0].status === 1001
                                                ? orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].alasan_batal === "assLbl55"
                                                    ? (20 / 100) *
                                                    ((10 / 100) *
                                                        orderApiData.filter(
                                                            (itemOrder) => itemOrder.sid === item.order_id
                                                        )[0].price)
                                                    : 0
                                                : orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.order_id
                                                )[0].tnosfee
                                            : 0,
                                });
                        });

                        let transactionOrderDataIn = transactionOrderData.filter(
                            (item) =>
                                item.order_status.status === "Selesai" ||
                                item.order_status.status === "Dibatalkan"
                        );
                        setAllTransactionData(transactionOrderDataIn);

                        const todayTransaction = getDataBetweenDate(
                            JSON.stringify(transactionOrderDataIn),
                            getTodayDate() + "T00:00:00",
                            getTodayDate() + "T23:59:59"
                        );
                        let totalAmountToday = 0;

                        todayTransaction
                            .sort(
                                (a, b) =>
                                    new Date(b.transaction_time) - new Date(a.transaction_time)
                            )
                            .forEach((item) => {
                                totalAmountToday =
                                    totalAmountToday + parseInt(item.gross_amount);
                            });

                        setTransactionData(todayTransaction);
                        setAllStatusTransactionData(todayTransaction);
                        setCaptureData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "capture"
                            )
                        );
                        setSettlementData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "settlement"
                            )
                        );
                        setPendingData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "pending"
                            )
                        );
                        setDenyData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "deny"
                            )
                        );
                        setCancelData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "cancel"
                            )
                        );
                        setExpireData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "expire"
                            )
                        );
                        setRefundData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "refund"
                            )
                        );
                        setPartialRefundData(
                            todayTransaction.filter(
                                (item) => item.transaction_status === "partial_refund"
                            )
                        );
                        setTotalAmountToday(totalAmountToday.toLocaleString("id-ID", {}));

                        // Income
                        fetch(
                            `${process.env.REACT_APP_PORTAL_API_URL}/global/company/fee`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                            .then((res) => res.json())
                            .then((data) => {
                                let incomeData = [];
                                data.data.forEach((item) => {
                                    incomeData.push({
                                        ...item,
                                        order_id_master: orderApiData.filter(
                                            (itemOrder) => itemOrder.invoice === item.order_id
                                        )[0].id,
                                        order_status:
                                            JSON.stringify(
                                                orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.trx_code
                                                )
                                            ) === "[]"
                                                ? { status: "Tidak Ada", status_color: "gray" }
                                                : orderApiData.filter(
                                                    (itemOrder) => itemOrder.sid === item.trx_code
                                                )[0].status === 1 ||
                                                    orderApiData.filter(
                                                        (itemOrder) => itemOrder.sid === item.trx_code
                                                    )[0].status === 2 ||
                                                    orderApiData.filter(
                                                        (itemOrder) => itemOrder.sid === item.trx_code
                                                    )[0].status === 3
                                                    ? { status: "Penugasan", status_color: "primary" }
                                                    : orderApiData.filter(
                                                        (itemOrder) => itemOrder.sid === item.trx_code
                                                    )[0].status === 990
                                                        ? { status: "Sedang Berlangsung", status_color: "blue" }
                                                        : orderApiData.filter(
                                                            (itemOrder) => itemOrder.sid === item.trx_code
                                                        )[0].status === 999
                                                            ? { status: "Selesai", status_color: "success" }
                                                            : orderApiData.filter(
                                                                (itemOrder) => itemOrder.sid === item.trx_code
                                                            )[0].status === 1001
                                                                ? { status: "Dibatalkan", status_color: "danger" }
                                                                : { status: "Tidak Ada", status_color: "gray" },
                                    });
                                });

                                setAllIncomeData(incomeData);
                                setEndingBalance(
                                    parseInt(
                                        incomeData[incomeData.length - 1].saldo
                                    ).toLocaleString("id-ID", {})
                                );

                                const todayTransactionIncome = getDataBetweenDate(
                                    JSON.stringify(incomeData),
                                    // getTodayDate() + "T00:00:00",
                                    getTodayDate() + "T00:00:00",
                                    getTodayDate() + "T23:59:59",
                                    "income"
                                );
                                let totalAmountTodayIncome = 0;

                                todayTransactionIncome
                                    .sort(
                                        (a, b) =>
                                            new Date(
                                                b.create_at.split("T")[0] +
                                                " " +
                                                b.create_at.split("T")[1].split("+")[0]
                                            ) -
                                            new Date(
                                                a.create_at.split("T")[0] +
                                                " " +
                                                a.create_at.split("T")[1].split("+")[0]
                                            )
                                    )
                                    .forEach((item) => {
                                        totalAmountTodayIncome =
                                            totalAmountTodayIncome + parseInt(item.fee);
                                    });
                                setTotalAmountTodayIncome(
                                    totalAmountTodayIncome.toLocaleString("id-ID", {})
                                );
                                setIncomeData(todayTransactionIncome);
                            })
                            .catch((error) => {
                                console.log(error);
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

    const updateTransactionDate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const splitDate = (date) => {
            let str = date.split("");
            str[10] = " ";
            str = str.join("");
            return str;
        };

        const formatDataBetween = (datas, sortType) => {
            return datas
                .sort(
                    (a, b) =>
                        new Date(
                            sortType === "transaction"
                                ? b.transaction_time
                                : b.create_at.split("T")[0] +
                                " " +
                                b.create_at.split("T")[1].split("+")[0]
                        ) -
                        new Date(
                            sortType === "transaction"
                                ? a.transaction_time
                                : a.create_at.split("T")[0] +
                                " " +
                                a.create_at.split("T")[1].split("+")[0]
                        )
                )
                .filter(
                    (item) =>
                        new Date(
                            sortType === "transaction"
                                ? item.transaction_time
                                : item.create_at.split("T")[0] +
                                " " +
                                item.create_at.split("T")[1].split("+")[0]
                        ).getTime() >=
                        new Date(
                            formData.get(
                                sortType === "transaction"
                                    ? "start_date_time"
                                    : "start_date_time_income"
                            )
                        ).getTime() &&
                        new Date(
                            sortType === "transaction"
                                ? item.transaction_time
                                : item.create_at.split("T")[0] +
                                " " +
                                item.create_at.split("T")[1].split("+")[0]
                        ).getTime() <=
                        new Date(
                            formData.get(
                                sortType === "transaction"
                                    ? "end_date_time"
                                    : "end_date_time_income"
                            )
                        ).getTime()
                );
        };

        if (formData.get("update_data_type") === "transaction") {
            setActiveStatus("all_status");

            localStorage.setItem(
                "getStartDateTransaction",
                splitDate(formData.get("start_date_time"))
            );
            localStorage.setItem(
                "getEndDateTransaction",
                splitDate(formData.get("end_date_time"))
            );

            let getUpdatedTransactionData = formatDataBetween(
                getAllTransactionData,
                "transaction"
            ).filter(
                (item) =>
                    item.order_status.status === "Selesai" ||
                    item.order_status.status === "Dibatalkan"
            );

            setTransactionData(getUpdatedTransactionData);
            setAllStatusTransactionData(getUpdatedTransactionData);
            setCaptureData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "capture"
                )
            );
            setSettlementData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "settlement"
                )
            );
            setPendingData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "pending"
                )
            );
            setDenyData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "deny"
                )
            );
            setCancelData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "cancel"
                )
            );
            setExpireData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "expire"
                )
            );
            setRefundData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "refund"
                )
            );
            setPartialRefundData(
                getUpdatedTransactionData.filter(
                    (item) => item.transaction_status === "partial_refund"
                )
            );

            let totalAmountBetween = 0;
            getUpdatedTransactionData.forEach((item) => {
                totalAmountBetween = totalAmountBetween + parseInt(item.gross_amount);
            });

            getUpdatedTransactionData.length === 0 &&
                setMessageEmptyData("Tidak ada transaksi diantara tanggal ini");
            setTotalAmountBetween(totalAmountBetween.toLocaleString("id-ID", {}));
        } else {
            localStorage.setItem(
                "getStartDateIncome",
                splitDate(formData.get("start_date_time_income"))
            );
            localStorage.setItem(
                "getEndDateIncome",
                splitDate(formData.get("end_date_time_income"))
            );

            let getUpdatedIncomeData = formatDataBetween(getAllIncomeData, "income");
            setIncomeData(getUpdatedIncomeData);

            let totalAmountBetweenIncome = 0;
            getUpdatedIncomeData.forEach((item) => {
                totalAmountBetweenIncome =
                    totalAmountBetweenIncome + parseInt(item.fee);
            });

            getUpdatedIncomeData.length === 0 &&
                setMessageEmptyData("Tidak ada transaksi diantara tanggal ini");
            setTotalAmountBetweenIncome(
                totalAmountBetweenIncome.toLocaleString("id-ID", {})
            );
        }
    };

    return (
        <>
            <Preloader show={!getTotalAmountToday ? true : false} />
            <Col xl={12} className="mt-2">
                <Tab.Container defaultActiveKey="income_tab">
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="transaction_tab">Transaksi</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="income_tab">Pendapatan</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane
                                    eventKey="transaction_tab"
                                // className="py-4"
                                >
                                    <Card border="light">
                                        <Card.Body>
                                            <Form method="POST" onSubmit={updateTransactionDate}>
                                                <Row className="mb-3">
                                                    <Col md={8}>
                                                        <Form.Label>Tanggal Transaksi</Form.Label>
                                                        <input
                                                            type="hidden"
                                                            name="update_data_type"
                                                            value="transaction"
                                                        />
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                name="start_date_time"
                                                                step="1"
                                                                defaultValue={getTodayDate() + "T00:00:00"}
                                                                required
                                                            />
                                                            <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                name="end_date_time"
                                                                step="1"
                                                                defaultValue={getTodayDate() + "T23:59:59"}
                                                                required
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col>
                                                        <Form.Label>&nbsp;</Form.Label>
                                                        <Form.Control
                                                            className="btn btn-primary"
                                                            type="submit"
                                                            name="btn_search_transaction"
                                                            value="Cari Transaksi"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form>
                                            <TnosDataTable
                                                title={[
                                                    {
                                                        variant: "blue",
                                                        status: "Semua Status",
                                                        value: "all_status",
                                                        length: getAllStatusTransactionData?.length,
                                                    },
                                                    {
                                                        variant: "soft-green",
                                                        status: "Capture",
                                                        value: "capture",
                                                        length: getCaptureData?.length,
                                                    },
                                                    {
                                                        variant: "soft-green",
                                                        status: "Settlement",
                                                        value: "settlement",
                                                        length: getSettlementData?.length,
                                                    },
                                                    {
                                                        variant: "secondary",
                                                        status: "Pending",
                                                        value: "pending",
                                                        length: getPendingData?.length,
                                                    },
                                                    {
                                                        variant: "danger",
                                                        status: "Deny",
                                                        value: "deny",
                                                        length: getDenyData?.length,
                                                    },
                                                    {
                                                        variant: "danger",
                                                        status: "Cancel",
                                                        value: "cancel",
                                                        length: getCancelData?.length,
                                                    },
                                                    {
                                                        variant: "danger",
                                                        status: "Expire",
                                                        value: "expire",
                                                        length: getExpireData?.length,
                                                    },
                                                    {
                                                        variant: "blue",
                                                        status: "Refund",
                                                        value: "refund",
                                                        length: getRefundData?.length,
                                                    },
                                                    {
                                                        variant: "blue",
                                                        status: "Partial Refund",
                                                        value: "partial_refund",
                                                        length: getPartialRefundData?.length,
                                                    },
                                                ].map((item) => {
                                                    return (
                                                        <Button
                                                            variant={item.variant}
                                                            className="btn btn-sm me-2 mb-2 text-white"
                                                            style={
                                                                getActiveStatus === item.value
                                                                    ? {
                                                                        boxShadow: "0px 5px 5px #888888",
                                                                        fontWeight: "bold",
                                                                    }
                                                                    : {}
                                                            }
                                                            onClick={() => {
                                                                setActiveStatus(item.value);
                                                                localStorage.setItem(
                                                                    "activeTransactionStatus",
                                                                    item.value
                                                                );
                                                                setTransactionData(
                                                                    item.value === "capture"
                                                                        ? getCaptureData
                                                                        : item.value === "settlement"
                                                                            ? getSettlementData
                                                                            : item.value === "pending"
                                                                                ? getPendingData
                                                                                : item.value === "deny"
                                                                                    ? getDenyData
                                                                                    : item.value === "cancel"
                                                                                        ? getCancelData
                                                                                        : item.value === "expire"
                                                                                            ? getExpireData
                                                                                            : item.value === "refund"
                                                                                                ? getRefundData
                                                                                                : item.value === "partial_refund"
                                                                                                    ? getPartialRefundData
                                                                                                    : getAllStatusTransactionData
                                                                );
                                                                setMessageEmptyData(
                                                                    "Belum ada data pada status ini"
                                                                );
                                                            }}
                                                        >
                                                            {item.status} &nbsp;
                                                            <Badge bg="dark">{item.length}</Badge>
                                                        </Button>
                                                    );
                                                })}
                                                subtitle={
                                                    localStorage.getItem("getStartDateTransaction") !==
                                                        getTodayDate() + " 00:00:00" ||
                                                        localStorage.getItem("getEndDateTransaction") !==
                                                        getTodayDate() + " 23:59:59"
                                                        ? `Total transaksi ( ${localStorage.getItem(
                                                            "getStartDateTransaction"
                                                        )} - ${localStorage.getItem(
                                                            "getEndDateTransaction"
                                                        )} ) : IDR ${getTotalAmountBetween}`
                                                        : `Total transaksi hari ini : IDR ${getTotalAmountToday}`
                                                }
                                                data={
                                                    <>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th className="border-0">No.</th>
                                                                <th className="border-0">Id Pemesanan</th>
                                                                <th className="border-0">Status Pemesanan</th>
                                                                <th className="border-0">Tipe Pembayaran</th>
                                                                <th className="border-0">Jumlah</th>
                                                                <th className="border-0">Harga Invoice</th>
                                                                <th className="border-0">Biaya Pembatalan</th>
                                                                <th className="border-0">Pendapatan Mitra</th>
                                                                <th className="border-0">
                                                                    Pendapatan Perusahaan
                                                                </th>
                                                                <th className="border-0">Waktu Transaksi</th>
                                                                <th className="border-0">Status Transaksi</th>
                                                                <th className="border-0">
                                                                    <ExcelFile
                                                                        element={
                                                                            <Badge
                                                                                bg="primary"
                                                                                className="badge-lg"
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                <FontAwesomeIcon icon={faFileExcel} />{" "}
                                                                                Export Excel
                                                                            </Badge>
                                                                        }
                                                                        filename={`masuk_${getActiveStatus}_( ${localStorage.getItem(
                                                                            "getStartDateTransaction"
                                                                        )} - ${localStorage.getItem(
                                                                            "getEndDateTransaction"
                                                                        )} )`}
                                                                    >
                                                                        <ExcelSheet
                                                                            data={getTransactionData}
                                                                            name="Data Masuk"
                                                                        >
                                                                            <ExcelColumn
                                                                                label="ID Pemesanan"
                                                                                value="order_id"
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Status Pemesanan"
                                                                                value={(col) => col.order_status.status}
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Tipe Pembayaran"
                                                                                value={(col) =>
                                                                                    humanizeText(col.payment_type)
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Jumlah"
                                                                                value={(col) =>
                                                                                    col.currency +
                                                                                    " " +
                                                                                    parseInt(
                                                                                        col.gross_amount
                                                                                    ).toLocaleString("id-ID", {})
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Harga Invoice"
                                                                                value={(col) =>
                                                                                    col.order_status.status ===
                                                                                        "Selesai" ||
                                                                                        col.order_status.status ===
                                                                                        "Dibatalkan" ||
                                                                                        col.order_status.status ===
                                                                                        "Penugasan" ||
                                                                                        col.order_status.status ===
                                                                                        "Sedang Berlangsung"
                                                                                        ? col.currency +
                                                                                        " " +
                                                                                        parseInt(
                                                                                            col.invoice_price
                                                                                        ).toLocaleString("id-ID", {})
                                                                                        : "Tidak Ada"
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Biaya Pembatalan"
                                                                                value={(col) =>
                                                                                    col.currency +
                                                                                    " " +
                                                                                    parseInt(
                                                                                        col.cut_price
                                                                                    ).toLocaleString("id-ID", {})
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Pendapatan Mitra"
                                                                                value={(col) =>
                                                                                    col.currency +
                                                                                    " " +
                                                                                    parseInt(col.mitrafee).toLocaleString(
                                                                                        "id-ID",
                                                                                        {}
                                                                                    )
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Pendapatan Perusahaan"
                                                                                value={(col) =>
                                                                                    col.currency +
                                                                                    " " +
                                                                                    parseInt(col.tnosfee).toLocaleString(
                                                                                        "id-ID",
                                                                                        {}
                                                                                    )
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Waktu Transaksi"
                                                                                value="transaction_time"
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Status Transaksi"
                                                                                value={(col) =>
                                                                                    col.transaction_status === "capture"
                                                                                        ? "Capture"
                                                                                        : col.transaction_status ===
                                                                                            "settlement"
                                                                                            ? "Settlement"
                                                                                            : col.transaction_status ===
                                                                                                "pending"
                                                                                                ? "Pending"
                                                                                                : col.transaction_status === "deny"
                                                                                                    ? "Deny"
                                                                                                    : col.transaction_status ===
                                                                                                        "cancel"
                                                                                                        ? "Cancel"
                                                                                                        : col.transaction_status ===
                                                                                                            "expire"
                                                                                                            ? "Expire"
                                                                                                            : col.transaction_status ===
                                                                                                                "refund"
                                                                                                                ? "Refund"
                                                                                                                : col.transaction_status ===
                                                                                                                    "partial_refund"
                                                                                                                    ? "Partial Refund"
                                                                                                                    : ""
                                                                                }
                                                                            />
                                                                        </ExcelSheet>
                                                                        {/* If you want to add sheet just copy ExcelSheet */}
                                                                    </ExcelFile>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getTransactionData?.length > 0 ? (
                                                                getTransactionData?.map((td, index) => (
                                                                    <TableRowTransaction
                                                                        key={`page-traffic-${td.order_id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={6}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </>
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>

                                <Tab.Pane
                                    eventKey="income_tab"
                                // className="py-4"
                                >
                                    <Card border="light">
                                        <Card.Body>
                                            <Form method="POST" onSubmit={updateTransactionDate}>
                                                <Row className="mb-3">
                                                    <Col md={8}>
                                                        <Form.Label>Waktu Pemasukan</Form.Label>
                                                        <input
                                                            type="hidden"
                                                            name="update_data_type"
                                                            value="income"
                                                        />
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                name="start_date_time_income"
                                                                step="1"
                                                                defaultValue={getTodayDate() + "T00:00:00"}
                                                                required
                                                            />
                                                            <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                name="end_date_time_income"
                                                                step="1"
                                                                defaultValue={getTodayDate() + "T23:59:59"}
                                                                required
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col>
                                                        <Form.Label>&nbsp;</Form.Label>
                                                        <Form.Control
                                                            className="btn btn-primary"
                                                            type="submit"
                                                            name="btn_search_transaction"
                                                            value="Cari"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form>
                                            <TnosDataTable
                                                title={"Saldo Akhir : IDR " + getEndingBalance}
                                                subtitle={
                                                    localStorage.getItem("getStartDateIncome") !==
                                                        getTodayDate() + " 00:00:00" ||
                                                        localStorage.getItem("getEndDateIncome") !==
                                                        getTodayDate() + " 23:59:59"
                                                        ? `Total Pendapatan ( ${localStorage.getItem(
                                                            "getStartDateIncome"
                                                        )} - ${localStorage.getItem(
                                                            "getEndDateIncome"
                                                        )} ) : IDR ${getTotalAmountBetweenIncome}`
                                                        : `Total Pendapatan Hari Ini : IDR ${getTotalAmountTodayIncome}`
                                                }
                                                data={
                                                    <>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th className="border-0">No.</th>
                                                                <th className="border-0">Invoice</th>
                                                                <th className="border-0">Id Pemesanan</th>
                                                                <th className="border-0">Status Pemesanan</th>
                                                                <th className="border-0">Tipe</th>
                                                                <th className="border-0">Biaya Layanan</th>
                                                                <th className="border-0">Total Pendapatan</th>
                                                                <th className="border-0">Waktu Pemasukan</th>
                                                                <th className="border-0">Dibuat Oleh</th>
                                                                <th className="border-0">
                                                                    <ExcelFile
                                                                        element={
                                                                            <Badge
                                                                                bg="primary"
                                                                                className="badge-lg"
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                <FontAwesomeIcon icon={faFileExcel} />{" "}
                                                                                Export Excel
                                                                            </Badge>
                                                                        }
                                                                        filename={`pendapatan_( ${localStorage.getItem(
                                                                            "getStartDateTransaction"
                                                                        )} - ${localStorage.getItem(
                                                                            "getEndDateTransaction"
                                                                        )} )`}
                                                                    >
                                                                        <ExcelSheet
                                                                            data={getIncomeData}
                                                                            name="Data Pendapatan"
                                                                        >
                                                                            <ExcelColumn
                                                                                label="ID Pemesanan"
                                                                                value="order_id"
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Status Pemesanan"
                                                                                value={(col) => col.order_status.status}
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Biaya Layanan"
                                                                                value={(col) =>
                                                                                    "IDR " +
                                                                                    parseInt(col.fee).toLocaleString(
                                                                                        "id-ID",
                                                                                        {}
                                                                                    )
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Total Pendapatan"
                                                                                value={(col) =>
                                                                                    "IDR " +
                                                                                    parseInt(col.saldo).toLocaleString(
                                                                                        "id-ID",
                                                                                        {}
                                                                                    )
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Waktu Pemasukan"
                                                                                value={(col) =>
                                                                                    col.create_at
                                                                                        .split("+")[0]
                                                                                        .split("T")[1] +
                                                                                    " " +
                                                                                    col.create_at
                                                                                        .split("+")[0]
                                                                                        .split("T")[0]
                                                                                        .split("-")[2] +
                                                                                    "-" +
                                                                                    col.create_at
                                                                                        .split("+")[0]
                                                                                        .split("T")[0]
                                                                                        .split("-")[1] +
                                                                                    "-" +
                                                                                    col.create_at
                                                                                        .split("+")[0]
                                                                                        .split("T")[0]
                                                                                        .split("-")[0]
                                                                                }
                                                                            />
                                                                            <ExcelColumn
                                                                                label="Dibuat Oleh"
                                                                                value={(col) =>
                                                                                    !col.create_by ||
                                                                                        col.create_by === "undefined"
                                                                                        ? "-"
                                                                                        : col.create_by
                                                                                }
                                                                            />
                                                                        </ExcelSheet>
                                                                        {/* If you want to add sheet just copy ExcelSheet */}
                                                                    </ExcelFile>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getIncomeData?.length > 0 ? (
                                                                getIncomeData?.map((td, index) => (
                                                                    <TableRowIncome
                                                                        key={`page-traffic-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={6}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </>
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
        </>
    );
};
