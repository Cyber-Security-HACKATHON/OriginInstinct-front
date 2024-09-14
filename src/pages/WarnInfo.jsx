import ModalBackground from "../components/WarnInfo/ModalBackground.jsx";
import WarnInfoModal from "../components/WarnInfo/WarnInfoModal.jsx";

export default function WarnInfo() {

  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-10 transition-all duration-0">
      <ModalBackground />
      <WarnInfoModal />
    </div>
  );
}
