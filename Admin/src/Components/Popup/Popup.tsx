import { X } from "lucide-react";
import "./modal.scss";
import { ReactNode, useEffect, useRef } from "react";

interface ModelProp {
  close: boolean;
  children: ReactNode;
  closeModal: () => void;
  disableScroll?: boolean;
}

const Modal: React.FC<ModelProp> = ({
  close,
  children,
  closeModal,
}: ModelProp) => {
  const modalRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event: Event) => {
  

      if (modalRef.current && !modalRef.current?.contains(event.target)) {
        closeModal();
      }
    };
    if (!close) {
      document.body.style.overflowY = "hidden";
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflowY = "unset";
    };
  }, [close, closeModal]);
  
  console.log(close)

  return (
    <div
      className={`modelbox-container `}
      style={{
        opacity: !close ? 1 : 0,
        zIndex: !close ? 50 : -3,
      }}
    >
      <div className="model-container " ref={modalRef}>
        <div className="model-content">
          {children}
        </div>
        <button className="model-close" onClick={closeModal}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default Modal;