import React from "react";
import type { Ho } from "../../../model/entities";

interface Props {
  ho: Ho;
}

const CarouselItemHo: React.FC<Props> = ({ ho }) => {
  return (
    <div className="card shadow-sm border-0 mx-2" style={{ minHeight: 320 }}>
      <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
        <img
          src={ho.hinhAnh}
          alt={ho.tenHo}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            transition: "transform 0.4s",
          }}
          className="hover-zoom"
        />
      </div>
      <div className="card-body">
        <h5 className="card-title text-primary">{ho.tenHo}</h5>
        <p className="card-text text-muted">{ho.moTa}</p>
      </div>
    </div>
  );
};

export default CarouselItemHo;