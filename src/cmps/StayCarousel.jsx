import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export function StayCarousel({ imgUrls }) {
    return (
        <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true}}
            navigation
            slidesPerView={1}
            className="stay-carousel"
            onClick={(swiper, event) => {
                if (
                    event.target.closest(
                        '.swiper-button-prev, .swiper-button-next, .swiper-pagination'
                    )
                ) {
                    event.stopPropagation()
                }
    }}
        >
            {imgUrls.map((url, idx) => (
                <SwiperSlide key={url}>
                    <img src={url} alt={`Stay image ${idx + 1}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

StayCarousel.propTypes = {
    imgUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
}
