import React from "react";
import "./Banner.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Banner() {
  return (
    <div className="banner">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}  // ✅ MUST include Autoplay
        slidesPerView={1}
        spaceBetween={10}
        loop={true}

        autoplay={{
          delay: 2000,               // ⏱ auto swipe every 2 sec
          disableOnInteraction: false,
        }}

        pagination={{ clickable: true }}
        navigation={true}
      >
        <SwiperSlide>
          <img src="https://i.graphicmama.com/blog/wp-content/uploads/2019/11/08101030/flat-design-black-friday-banner.jpg" alt="1" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="https://images.unsplash.com/photo-1586880244386-8b3c5f5b5b3b?w=1600" alt="2" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600" alt="3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Banner;