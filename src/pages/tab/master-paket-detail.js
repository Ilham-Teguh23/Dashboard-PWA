import { Card, Col} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import CurrencyFormatter from "../../components/CurrencyFormatter";

export default () => {

    const [getMasterPaket, setMasterPaket] = useState([])
    const [getMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    )

    const TableRow = (props) => {
        const {
            detail
        } = props;

        return (
            <tr>
                <td className="text-center">{props.num}</td>
                <td className="text-center">{detail.nama_paket ? detail.nama_paket : "-"}</td>
                <td className="text-center">{detail.limitContact ? detail.limitContact : '-'}</td>
                <td className="text-center">
                    <CurrencyFormatter amount={detail.amount} />
                </td>
                <td className="text-center">{detail.durationDate ? detail.durationDate + " Hari" : '-'}</td>
                <td className="text-center">{detail.description ? detail.description : '-'}</td>
                {/* <td className="text-center">
                    <Link to={`/tab/master-paket/${detail.id_master_paket}`} target="_blank" >
                        <Button variant="primary" size="sm" className="text-white" >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td> */}
            </tr>
        )
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_TAB_URL}/master_paket/all`)
            .then((res) => res.json())
            .then((data) => {
                setMasterPaket(data)
            }).catch((err) => {
                console.log(err);
            })
    })

    return (
        <>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <TnosDataTable
                            data={
                                <>
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-0 text-center">No</th>
                                            <th className="border-0 text-center">Nama Paket</th>
                                            <th className="border-0 text-center">Limit Kontak</th>
                                            <th className="border-0 text-center">Harga</th>
                                            <th className="border-0 text-center">Durasi</th>
                                            <th className="border-0 text-center">Description</th>
                                            {/* <th className="border-0 text-center">Detail</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getMasterPaket?.length > 0 ? (
                                            getMasterPaket?.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    {...td}
                                                    num={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={8}>{getMessageEmptyData}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            }
                        ></TnosDataTable>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}