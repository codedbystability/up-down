import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/parallax";
import 'swiper/css/effect-coverflow';
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import {Link} from "react-router-dom";
import associateServices from "../../services";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Loading from "../../components/loading";
import {useTranslation} from "react-i18next";

const BottomResults = () => {

    const {t} = useTranslation()
    const {activeParity} = useSelector(state => state.informationReducer)

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {
        setLoading(true)
        associateServices.getLastResults({
            code: activeParity?.code
        }).then(res => {
            setData(res?.data)
            setLoading(false)
        })
    }, [activeParity?.code])

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div id="ticker" className="ticker">
                        <span className="ticker__title">{t('bet.last-results')}</span>
                        {
                            loading ? <Loading/> :
                                <div className="ticker__content">

                                    <Swiper
                                        modules={[Autoplay]} // ⬅️ REQUIRED
                                        spaceBetween={4} // Space between slides
                                        slidesPerView={4} // Show partial slides
                                        loop
                                        lazy={"true"}
                                        autoplay={{
                                            delay: 2000,
                                            disableOnInteraction: false,
                                        }}
                                        breakpoints={{
                                            1660: {
                                                slidesPerView: 16,
                                            },
                                            1440: {
                                                slidesPerView: 14,
                                            },
                                            1200: {
                                                slidesPerView: 10,
                                            },
                                            992: {
                                                slidesPerView: 8,
                                            },
                                            768: {
                                                slidesPerView: 4,
                                            },
                                            576: {
                                                slidesPerView: 2, // Correct this if it's meant for small screens
                                            },
                                        }}
                                        className="mySwiper"


                                    >

                                        {
                                            data?.map((debit, i) => (
                                                <SwiperSlide key={i}>
                                                    <Link
                                                        className="splide__slide">
                                                <span
                                                    className={`ticker__round ticker__round--${debit}`}>{t(`bet.${debit?.toLowerCase()}`)}</span>
                                                    </Link>
                                                </SwiperSlide>

                                            ))
                                        }


                                    </Swiper>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    )

}

export default BottomResults
