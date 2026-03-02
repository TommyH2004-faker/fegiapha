import React, { useEffect, useState } from "react";
import Slider from "react-slick";  // Import từ react-slick, KHÔNG phải @mui/material
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import getAllHo from "../../../api/HoApi";
import type { Ho } from "../../../model/entities";
import CarouselItemHo from "./Carouseltem";

const CarouselHo: React.FC = () => {
  const [hos, setHos] = useState<Ho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllHo()
      .then((data) => {
        setHos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h3>Đang tải dữ liệu...</h3>;
  if (error) return <h3>Gặp lỗi: {error}</h3>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="my-5">
<div style={{ width: 80, height: 4, background: "#b9cf0d", borderRadius: 4 }} />

      <Slider {...settings}>
        {hos.map((ho) => (
          <div key={ho.id}>
            <CarouselItemHo ho={ho} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselHo;