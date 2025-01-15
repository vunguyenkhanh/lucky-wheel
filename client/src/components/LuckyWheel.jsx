import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWheelConfig, spin } from '../api/wheelApi';

const LuckyWheel = () => {
  const navigate = useNavigate();
  const [mustSpin, setMustSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [wheelData, setWheelData] = useState([]);
  const [config, setConfig] = useState({
    colors: [],
    fontFamily: 'Arial',
  });
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    loadWheelData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadWheelData = async () => {
    try {
      const { config, prizes } = await getWheelConfig();

      // Format data cho wheel
      const data = prizes.map((prize) => ({
        option: prize.name,
        optionSize: 16,
        style: { fontSize: 14 },
      }));

      setWheelData(data);
      setConfig(config);
    } catch (error) {
      console.error('Load wheel data error:', error);
      toast.error(error.response?.data?.error || 'Lỗi tải dữ liệu vòng quay');
    }
  };

  const handleSpinClick = async () => {
    if (spinning) return;

    try {
      setSpinning(true);
      const result = await spin();
      setPrizeNumber(result.prizeIndex);
      setMustSpin(true);
    } catch (error) {
      console.error('Spin error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error(error.response?.data?.error || 'Lỗi quay thưởng');
      }
      setSpinning(false);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSpinning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          backgroundColors={config.colors}
          textColors={['#ffffff']}
          fontFamily={config.fontFamily}
          outerBorderColor="#f9d71c"
          outerBorderWidth={3}
          radiusLineColor="#f9d71c"
          radiusLineWidth={2}
          perpendicularText={true}
          textDistance={65}
          onStopSpinning={handleStopSpinning}
        />
        <button
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-500
            disabled:bg-gray-400 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50
            transition-colors duration-200`}
          onClick={handleSpinClick}
          disabled={spinning}
        >
          {spinning ? 'Đang quay...' : 'Quay!'}
        </button>
      </div>
    </div>
  );
};

export default LuckyWheel;
