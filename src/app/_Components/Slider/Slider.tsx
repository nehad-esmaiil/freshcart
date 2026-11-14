'use client';
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

function SliderArrows() {
  const swiper = useSwiper();
  const buttonClass = 'absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-lg text-green-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white hover:text-green-600 md:flex';

  return (
    <>
      <button type="button" aria-label="Previous slide" className={`${buttonClass} left-4`} onClick={() => swiper.slidePrev()}>
        <FaChevronLeft aria-hidden />
      </button>
      <button type="button" aria-label="Next slide" className={`${buttonClass} right-4`} onClick={() => swiper.slideNext()}>
        <FaChevronRight aria-hidden />
      </button>
    </>
  );
}

export default function Slider({
  spaceBetween = 0,
  sliderPerView = 1,
  listOfSlides,
}: {
  spaceBetween?: number;
  sliderPerView?: number;
  listOfSlides: {
    image: string;
    title: string;
    desc: string;
    link: string;
    linkDesc: string;
    link2?: string;
    linkDesc2?: string;
    color?: string;
  }[];
}) {
  return (
    <Swiper
      className="h-100"
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      spaceBetween={spaceBetween}
      slidesPerView={sliderPerView}
      loop={true}
    >
      {listOfSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="h-100 flex items-center justify-center relative"
          >
            {/* Gradient overlay */}
            <div className="overlay px-4 py-8 text-white w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50 md:px-20">
              <div className="container mx-auto h-full content-center">
                {/* Slide Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="text-white text-3xl font-bold mb-4 max-w-96"
                >
                  {slide.title}
                </motion.h2>
                {/* Slide Description */}
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
                  {slide.desc}
                </motion.p>
                {/* Buttons */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }} className="mt-4 flex flex-wrap gap-2">
                  <a
                    className={`inline-block rounded-lg border-2 border-white/50 bg-white px-6 py-2 font-semibold transition-transform hover:scale-105 ${
                      slide.color === 'green-500'
                        ? 'text-green-500'
                        : slide.color === 'blue-500'
                          ? 'text-blue-500'
                          : slide.color === 'purple-500'
                            ? 'text-purple-500'
                            : 'text-black'
                    }`}
                    href={slide.link}
                  >
                    {slide.linkDesc}
                  </a>
                  {slide.link2 && slide.linkDesc2 && (
                    <Link
                      className="inline-block rounded-lg border-2 border-white/50 px-6 py-2 font-semibold text-white transition-transform hover:scale-105"
                      href={slide.link2}
                    >
                      {slide.linkDesc2}
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <SliderArrows />
    </Swiper>
  );
}
