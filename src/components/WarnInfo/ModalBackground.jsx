import { useRecoilState } from "recoil";
import { infoModalState } from "../../recoil/atoms";

export default function ModalBackground() {
  const [, setModalOpen] = useRecoilState(infoModalState)

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/20" onClick={() => setModalOpen(false)}>
    </div>
  );
}
