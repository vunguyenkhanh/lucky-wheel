import { useEffect, useRef } from 'react';
import { useWheel } from '../../hooks/useWheel';
import LoadingOverlay from '../common/LoadingOverlay';
import WheelResult from './WheelResult';

function LuckyWheel() {
  const canvasRef = useRef(null);
  const {
    prizes,
    spinResult,
    spinning,
    rotation,
    showResult,
    handleSpin,
    resetWheel,
    setShowResult,
    loading,
  } = useWheel();

  useEffect(() => {
    if (!prizes.length) return;
    drawWheel();
  }, [prizes, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = Math.min(window.innerWidth - 40, 500);
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const sliceAngle = (2 * Math.PI) / prizes.length;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    prizes.forEach((prize, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(prize.name, radius - 20, 5);
      ctx.restore();
    });

    ctx.restore();
  };

  useEffect(() => {
    const handleResize = () => {
      if (!prizes.length) return;
      drawWheel();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [prizes, drawWheel]);

  return (
    <LoadingOverlay loading={loading}>
      <div className="flex flex-col items-center animate-fade-in">
        <canvas ref={canvasRef} className="border rounded-full shadow-lg" />
        <button
          onClick={handleSpin}
          disabled={spinning || loading}
          className={`mt-8 btn btn-primary ${
            spinning || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {spinning ? 'Đang quay...' : loading ? 'Đang xử lý...' : 'Quay Ngay'}
        </button>

        {showResult && spinResult && (
          <WheelResult
            prize={spinResult}
            onClose={() => {
              setShowResult(false);
              resetWheel();
            }}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}

export default LuckyWheel;
