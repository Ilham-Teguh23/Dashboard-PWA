import React, { useEffect, useState } from "react";
import {
    // Col,
    // Row,
    Badge,
    Card,
    Form,
    Button,
    ButtonGroup,
    InputGroup,
} from "@themesberg/react-bootstrap";
import TodayDate from "./TodayDate";
import { TodayDates } from "./TnosDates";
import DateBetweenFilter from "./DateBetweenFilter";
import { TnosDatesYear, TnosDatesMonth } from "./TnosDates";
import { parseISO, format } from "date-fns";
import numeral from "numeral";
import { Line } from "@ant-design/plots";

export default (props) => {
    const { suffix, dataProps, dateName, priceName, status } = props;

    // const [getDataTabs, setDataTabs] = useState();
    const [getTotalAmount, setTotalAmount] = useState();
    const [getOrderFilter, setOrderFilter] = useState("month");
    const [getDataTypeFilter, setDataTypeFilter] = useState("amount");
    const [getChartData, setChartData] = useState([]);

    // Function : Change data structure
    const changeDataStructures = (
        datas,
        datasName = suffix,
        dataStatusName = status.name,
        dataPriceName = priceName,
        statusDatas = status.datas
    ) => {
        let result = {
            name: datasName,
            datas: datas,
            length: datas.length,
            totalPrice: datas.reduce(
                (acc, item) => acc + parseInt(item[dataPriceName]),
                0
            ),
            statusDatas: [],
        };

        for (let status of statusDatas) {
            let filteredData = status.code
                ? datas.filter((item) => status.code.includes(item[dataStatusName]))
                : [];
            let totalPrice = filteredData.reduce(
                (acc, item) => acc + parseInt(item[dataPriceName]),
                0
            );
            let newStatus = Object.assign({}, status, {
                datas: filteredData,
                length: filteredData.length,
                totalPrice: totalPrice,
            });
            result.statusDatas.push(newStatus);
        }

        return result;
    };

    //   Function : Get filtered data between date
    const getDataBetweenDate = (startDate, endDate) => {
        return DateBetweenFilter(dataProps, dateName, startDate, endDate);
    };

    //   Function : Change data to chart data
    const changeToChart = (
        dataBefore,
        dateType = "date",
        monthDiff = [TodayDates("year"), TodayDates("month")]
    ) => {
        let datas = JSON.parse(dataBefore);
        // Membuat array baru dengan time, status, value, dan valuePrice
        const processedOutput = [];

        // Format Date Created
        datas.forEach((item) => {
            item[dateName] = format(
                parseISO(item[dateName]),
                dateType === "date" ? "HH" : dateType === "month" ? "dd" : "MM"
            );
        });

        // Menentukan status berdasarkan nilai status
        datas.forEach((item) => {
            status.datas.forEach((itemStatus) => {
                if (itemStatus.code.includes(item[status.name])) {
                    item[status.name] = itemStatus.name;
                }
            });
        });

        // Fungsi Update Chart
        const updateChart = (i) => {
            let time = i < 10 ? `0${i}` : `${i}`;
            let timeData = datas.filter((item) => parseInt(item[dateName]) === i);
            let statusData = [];
            let statusProps = status.name;
            status.datas.forEach((itemStatus) => {
                let status = itemStatus.name;
                let filteredData = timeData.filter(
                    (item) => item[statusProps] === status
                );
                let value = filteredData.length;
                let valuePrice = 0;
                filteredData.forEach((item) => {
                    valuePrice += parseInt(item[priceName]);
                });

                statusData.push({
                    status: status,
                    value: value,
                    valuePrice: valuePrice,
                });
            });

            processedOutput.push({
                time: time,
                statusData: statusData,
            });
        };

        // Menetukan Last Day untuk month
        let lastDay = new Date(monthDiff[0], monthDiff[1], 0)
            .toString()
            .split(" ")[2];

        // Menghitung value dan valuePrice untuk setiap time dan status
        [
            ["date", 0, 23],
            ["month", 1, lastDay],
            ["year", 1, 12],
        ].forEach((item) => {
            if (dateType === item[0]) {
                for (let i = item[1]; i <= item[2]; i++) {
                    updateChart(i);
                }
            }
        });

        // Mengubah format valuePrice
        processedOutput.forEach((item) => {
            item.statusData.forEach((status) => {
                status.valuePrice = `IDR ${numeral(status.valuePrice).format("0,0")}`;
            });
        });

        return processedOutput.flatMap((entry) => {
            return entry.statusData.map((statusData) => {
                return {
                    time: entry.time,
                    status: statusData.status,
                    value: statusData.value,
                    valuePrice: statusData.valuePrice,
                };
            });
        });
    };

    //   Function : Settings Cart
    const getOnClickDatas = (
        targetValue,
        dateDatasName = "",
        dateDatasValue = ""
    ) => {
        let datePick =
            localStorage.getItem("datePick") !== ""
                ? localStorage.getItem("datePick")
                : TodayDate();
        let datePickMonth =
            localStorage.getItem("datePickMonth") !== ""
                ? localStorage.getItem("datePickMonth")
                : new Date().getMonth() < 10
                    ? "0" + (new Date().getMonth() + 1)
                    : new Date().getMonth() + 1;
        let datePickYear = new Date().getFullYear();
        if (targetValue === "month") {
            if (localStorage.getItem("datePickYear") !== "") {
                datePickYear = localStorage.getItem("datePickYear");
            }
        } else if (targetValue === "year") {
            if (localStorage.getItem("datePickYearYear") !== "") {
                datePickYear = localStorage.getItem("datePickYearYear");
            }
        }

        let lastDay = new Date(datePickYear, datePickMonth, 0)
            .toString()
            .split(" ")[2];

        if (targetValue === "date") {
            if (dateDatasName === "date_pick") {
                datePick = dateDatasValue;
            }
        }

        let startDate =
            targetValue === "date"
                ? datePick + "T00:00:00"
                : targetValue === "month"
                    ? datePickYear + "-" + datePickMonth + "-01T00:00:00"
                    : targetValue === "year"
                        ? datePickYear + "-01-01T00:00:00"
                        : "";
        let endDate =
            targetValue === "date"
                ? datePick + "T23:59:59"
                : targetValue === "month"
                    ? datePickYear + "-" + datePickMonth + "-" + lastDay + "T23:59:59"
                    : targetValue === "year"
                        ? datePickYear + "-12-31T23:59:59"
                        : "";

        setOrderFilter(targetValue);

        let dateBetween = getDataBetweenDate(startDate, endDate);

        setTotalAmount(changeDataStructures(dateBetween));
        setChartData(
            changeToChart(JSON.stringify(dateBetween), targetValue, [
                datePickYear,
                datePickMonth,
            ])
        );
    };

    useEffect(() => {
        setOrderFilter("date");
        localStorage.setItem("datePick", "");
        localStorage.setItem("datePickMonth", "");
        localStorage.setItem("datePickYear", "");
        localStorage.setItem("datePickYearYear", "");

        if (dataProps) {
            // setDataTabs(changeDataStructures(dataProps));
            const todayData = getDataBetweenDate(
                TodayDate() + "T00:00:00",
                TodayDate() + "T23:59:59"
            );
            setTotalAmount(changeDataStructures(todayData));
            setChartData(changeToChart(JSON.stringify(todayData)));
        }

        return () => {
            // cleanup
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataProps]);

    const config = {
        data: getChartData,
        xField: "time",
        yField: getDataTypeFilter === "amount" ? "value" : "valuePrice",
        seriesField: "status",
        color: status.datas.map((item) => item.color),
        yAxis: {
            label: {
                formatter: (v) =>
                    `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        legend: {
            position: "top",
        },
        smooth: true,
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
    };

    return (
        <>
            <div className="d-flex flex-wrap justify-content-center">
                {getTotalAmount?.statusDatas.map((d) => (
                    <>
                        <Button
                            className="btn btn-sm me-2 mb-2 text-white"
                            style={{
                                backgroundColor: d.color,
                                border: "none",
                                cursor: "default",
                            }}
                        >
                            {d.name} &nbsp;
                            <Badge bg="dark">{d.length}</Badge>
                        </Button>
                    </>
                ))}
            </div>
            <Card border="light" className="shadow-sm">
                <Card.Body>
                    <div className="d-flex flex-wrap justify-content-center">
                        <ButtonGroup className="my-1">
                            {[
                                ["date", "Tanggal"],
                                ["month", "Bulan"],
                                ["year", "Tahun"],
                            ].map((item) => {
                                return (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        value={item[0]}
                                        active={getOrderFilter === item[0] && "true"}
                                        onClick={(e) => {
                                            getOnClickDatas(e.target.value);
                                        }}
                                    >
                                        {item[1]}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>
                        &nbsp; &nbsp;
                        {priceName && (
                            <ButtonGroup className="my-1 me-2">
                                {[
                                    ["amount", "Jumlah"],
                                    ["income", "Penjualan"],
                                ].map((item) => {
                                    return (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            value={item[0]}
                                            active={getDataTypeFilter === item[0] && "true"}
                                            onClick={(e) => setDataTypeFilter(e.target.value)}
                                        >
                                            {item[1]}
                                        </Button>
                                    );
                                })}
                            </ButtonGroup>
                        )}
                        &nbsp;
                        {getOrderFilter === "date" ? (
                            <Form.Control
                                style={{ maxWidth: "320px" }}
                                type="date"
                                id="filter_pick"
                                name="date_pick"
                                defaultValue={
                                    localStorage.getItem("datePick") !== ""
                                        ? localStorage.getItem("datePick")
                                        : TodayDate()
                                }
                                onChange={(e) => {
                                    localStorage.setItem("datePick", e.target.value);
                                    getOnClickDatas(
                                        getOrderFilter,
                                        e.target.name,
                                        e.target.value
                                    );
                                }}
                            />
                        ) : getOrderFilter === "month" ? (
                            <InputGroup style={{ maxWidth: "320px" }}>
                                <Form.Select
                                    style={{ width: "auto" }}
                                    name="date_pick_month"
                                    onChange={(e) => {
                                        localStorage.setItem("datePickMonth", e.target.value);
                                        getOnClickDatas(
                                            getOrderFilter,
                                            e.target.name,
                                            e.target.value
                                        );
                                    }}
                                >
                                    {TnosDatesMonth().map((item, index) => (
                                        <option
                                            key={"month_month_pick_" + index}
                                            value={
                                                index < 9 ? "0" + (index + 1).toString() : index + 1
                                            }
                                            selected={
                                                localStorage.getItem("datePickMonth") !== ""
                                                    ? parseInt(localStorage.getItem("datePickMonth")) ===
                                                    index + 1
                                                    : parseInt(TodayDate().split("-")[1]) === index + 1
                                                        ? true
                                                        : false
                                            }
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Select
                                    style={{ width: "auto" }}
                                    name="date_pick_year"
                                    onChange={(e) => {
                                        localStorage.setItem("datePickYear", e.target.value);
                                        getOnClickDatas(
                                            getOrderFilter,
                                            e.target.name,
                                            e.target.value
                                        );
                                    }}
                                >
                                    {TnosDatesYear(2022).map((item, index) => (
                                        <option
                                            key={"month_year_pick_" + index}
                                            value={item}
                                            selected={
                                                localStorage.getItem("datePickYear") !== ""
                                                    ? parseInt(localStorage.getItem("datePickYear")) ===
                                                    item
                                                    : parseInt(TodayDate().split("-")[0]) === item
                                                        ? true
                                                        : false
                                            }
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        ) : getOrderFilter === "year" ? (
                            <Form.Select
                                style={{ maxWidth: "320px" }}
                                name="date_pick_year"
                                onChange={(e) => {
                                    localStorage.setItem("datePickYearYear", e.target.value);
                                    getOnClickDatas(
                                        getOrderFilter,
                                        e.target.name,
                                        e.target.value
                                    );
                                }}
                            >
                                {TnosDatesYear(2022).map((item, index) => (
                                    <option
                                        key={"year_year_pick_" + index}
                                        value={item}
                                        selected={
                                            localStorage.getItem("datePickYearYear") !== ""
                                                ? parseInt(localStorage.getItem("datePickYearYear")) ===
                                                item
                                                : parseInt(TodayDate().split("-")[0]) === item
                                                    ? true
                                                    : false
                                        }
                                    >
                                        {item}
                                    </option>
                                ))}
                            </Form.Select>
                        ) : (
                            ""
                        )}
                    </div>
                </Card.Body>
                <Card.Body className="p-2">
                    {getChartData && <Line {...config} />}
                </Card.Body>
            </Card>
        </>
    );
};
