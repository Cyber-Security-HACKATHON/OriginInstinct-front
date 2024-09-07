import ModalBackground from "../components/WarnInfo/ModalBackground.jsx";
import WarnInfoModal from "../components/WarnInfo/WarnInfoModal.jsx";

export default function WarnInfo() {

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-10">
      <ModalBackground />
      <WarnInfoModal />
    </div>
  );
}
