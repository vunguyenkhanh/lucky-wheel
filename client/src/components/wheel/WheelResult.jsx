import Modal from '../common/Modal';

function WheelResult({ prize, onClose }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Kết Quả Quay Thưởng">
      <div className="text-center animate-slide-up">
        <img
          src={`/assets/images/prizes/${prize.imageUrl}`}
          alt={prize.name}
          className="w-32 h-32 mx-auto mb-4 object-contain animate-fade-in"
        />
        <h3 className="text-xl font-bold text-indigo-600 mb-2">Chúc mừng!</h3>
        <p className="text-gray-600 mb-6">
          Bạn đã trúng: <span className="font-bold text-gray-800">{prize.name}</span>
        </p>
        <button onClick={onClose} className="btn btn-primary">
          Đóng
        </button>
      </div>
    </Modal>
  );
}

export default WheelResult;
