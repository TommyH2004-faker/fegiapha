import { useEffect, useState } from "react";
import type { Ho } from "../../model/entities";
import { getTop3Ho } from "../../api/HoApi";


const HeaderTop3Ho = () => {
  const [hos, setHos] = useState<Ho[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTop3Ho()
      .then(setHos)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="row g-4">
      {hos.map((ho) => (
        <div className="col-md-4" key={ho.id}>
          <div
            className="position-relative rounded overflow-hidden"
            style={{
              height: "260px",
              backgroundImage: `url(${ho.hinhAnh})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ background: "rgba(0,0,0,0.55)" }}
            />

            {/* Text */}
            <div className="position-absolute bottom-0 p-3 text-white">
              <h4 className="fw-bold ">Nhà thờ </h4>
              <p className="mb-0 text-white">{ho.tenHo}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeaderTop3Ho;
