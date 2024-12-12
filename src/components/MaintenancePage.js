import React from "react";
import { Breadcrumb } from "@themesberg/react-bootstrap";

export const MaintenancePage = (props) => {
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            {/* <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item> */}
            {/* <Breadcrumb.Item>Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>Bootstrap tables</Breadcrumb.Item> */}
          </Breadcrumb>
          {/* <h4 className="text-center">TNOS Dashboard</h4>
          <p className="mb-0">Menu ini sedang dalam perbaikan</p> */}
        </div>
      </div>

      <h1 className="text-center" style={{ marginTop: "120px" }}>
        503
      </h1>
      <p className="text-center" style={{ marginBottom: "250px" }}>
        Menu ini sedang dalam perbaikan
        <br />
        <small>
          <a href="/">Kembali ke Beranda</a>
        </small>
      </p>
    </>
  );
};
