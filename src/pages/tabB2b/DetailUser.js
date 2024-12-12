import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default () => {
    const [getOrderDetailData, setOrderDetailData] = useState();
    const [getPaket, setPaket] = useState([]);
    const [getMemberCode, setMemberCode] = useState("");

    const location = useLocation()
    const id = location.pathname.split("/")[3];

    const getDataExternalByIdInstitution = () => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/user/${id}/show`)
            .then((res) => res.json())
            .then((response) => {

                console.log(response);
                
                setMemberCode(response.data.member_account_code)
                setOrderDetailData(response.data)

            }).catch((error) => {
                toast(error)
            });
    }

    useEffect(() => {
        getDataExternalByIdInstitution();
    }, []);

    return (
        <>
            {/* <Row>
                <Preloader show={!getOrderDetailData ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/data-akun/internal">
                        Data Akun
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Akun Internal</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6>Detail Akun Eksternal</h6>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.nama}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Email</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.email}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Username</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.username}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Kode Institusi</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.institution_id}
                                            </p>
                                        </Col>
                                        <Col md={12}>
                                            <small style={{ color: "#7376A1" }}>Nomor HP</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.phone_number}
                                            </p>
                                        </Col>

                                        {getOrderDetailData?.detailMembership?.nama_paket == "Video Call" ? (
                                            <>

                                            </>
                                        ) : (
                                            getOrderDetailData?.detailMembership?.remainingDate < 7 ? (
                                                <Col md={6}>
                                                    <small style={{ color: "#7376A1", fontWeight: 'bold' }}>
                                                        Ganti Paket
                                                    </small>
                                                    <Form method="POST" style={{ marginTop: '5px' }}>
                                                        <Form.Select name="id_master_paket_organization" onChange={handleChange} style={{ marginBottom: '10px' }}>
                                                            <option value="">- Pilih Kategori -</option>
                                                            {getPaket?.length > 0 ? (
                                                                getPaket?.map((upgradePaket, index) => (
                                                                    <option value={upgradePaket.id_master_paket_organization}>
                                                                        {upgradePaket.nama_paket}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value={""}>- Loading -</option>
                                                            )}
                                                        </Form.Select>
                                                        <Button variant="primary" size="sm" onClick={handleSubmit}>
                                                            <FontAwesomeIcon icon={faSave} /> Simpan
                                                        </Button>
                                                    </Form>
                                                </Col>
                                            ) : ("")
                                        )}
                                    </Row>
                                </Col>
                                <Col md={6}>
                                    <h6>Detail Akun Membership</h6>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama Paket</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.detailMembership?.nama_paket}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Durasi Waktu</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.detailMembership?.remainingDate} Hari
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Tanggal Mulai</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.detailMembership?.start_date}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Tanggal Selesai</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.detailMembership?.end_date}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Status</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderDetailData?.detailMembership?.status_subscribe}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}
        </>
    );
};
