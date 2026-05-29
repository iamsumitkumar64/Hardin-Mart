export const sliderSettings = {
    // dots: true,
    // className: "center",
    // centerMode: true,
    infinite: false,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    autoplay: false,
    vertical: false,
    swipeToSlide: true,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
};