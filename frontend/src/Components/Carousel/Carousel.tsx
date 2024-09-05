import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Banner } from "../../models/banner.model";

interface CarouselProp{
  props : Banner[]
}
const Carousel: React.FC<CarouselProp> = ({props}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<number>();

  const prevSlide = () => {
    const newSlide =
      currentSlide === 0 ? props.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    imageRef.current?.classList.add("fade-in");
  };
  const nextSlide = () => {
    const newSlide =
      currentSlide === props.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
    imageRef.current?.classList.add("fade-in");
  };

  const removeAnimation = () => {
    imageRef.current?.classList.remove("fade-in");
  };

  const pauseSlider = () => {
    clearInterval(sliderRef.current);
  };

  const autoPlay = () => {
    sliderRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  useEffect(() => {
    imageRef.current?.addEventListener("animationend", removeAnimation);

    autoPlay();
    return () => {
      pauseSlider();
      imageRef.current?.addEventListener("animationend", removeAnimation);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-full py-8 group z-1">
      <div
        className="w-full h-full overflow-hidden duration-500 bg-center bg-no-repeat bg-cover rounded-xl"
        ref={imageRef}
        style={{
          backgroundImage: `url(${props[currentSlide]?.image})`,
        }}
      >
        <div className="absolute cursor-pointer bg-[var(--dark-text)] text-[var(--light-text)] p-1 rounded-full group-hover:block hidden top-[50%] left-8 -translate-x-0 translate-y-[-50%] hover:bg-[var(--secondary-color)]">
          <ArrowLeft className="hover:text-[var(--dark-text)] " onClick={prevSlide} />
        </div>
        <div className="absolute cursor-pointer bg-[var(--dark-text)] text-[var(--light-text)] p-1 rounded-full group-hover:block hidden top-[50%] right-8 -translate-x-0 translate-y-[-50%] hover:bg-[var(--secondary-color)]">
          <ArrowRight className="hover:text-[var(--dark-text)] " onClick={nextSlide} />
        </div>
      </div>
    </div>
  );
};

export default Carousel;

{
  /* <img
          src={props.slides[currentSlide].url}
          alt="banner"
          className="object-cover object-center w-full h-full"
        /> */
}

export const MultiCardSlider:React.FC = () => {
  return (
    <div className="w-full h-full">Carousel</div>
  )
}