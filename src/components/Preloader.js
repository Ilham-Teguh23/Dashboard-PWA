import React from "react";
import { Image } from "@themesberg/react-bootstrap";

import TnosLogoLoader from "../assets/img/technologies/tnos_logo_loader.gif";

export default (props) => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={TnosLogoLoader}
        height={150}
      />
    </div>
  );
};
