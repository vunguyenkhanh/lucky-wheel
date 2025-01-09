import { useEffect, useRef } from 'react';

function WheelCanvas({ prizes, mustSpin, setMustSpin, prizeNumber }) {
  const canvasRef = useRef(null);
  const currentRotation = useRef(0);
  const isSpinning = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segments
      prizes.forEach((prize, index) => {
        const angle = (2 * Math.PI) / prizes.length;
        const startAngle = index * angle;
        const endAngle = startAngle + angle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Alternate colors
        ctx.fillStyle = index % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(prize.name, radius - 20, 5);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.stroke();
    };

    const spinWheel = () => {
      if (!isSpinning.current) return;

      // Calculate target rotation for prize
      const targetRotation =
        prizeNumber !== null ? 360 * 5 + (360 / prizes.length) * prizeNumber : 360 * 5;

      // Easing function
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      let startTime = null;
      const duration = 5000; // 5 seconds

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Calculate current rotation using easing
        const rotation = easeOut(progress) * targetRotation;
        currentRotation.current = rotation;

        // Clear and redraw
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isSpinning.current = false;
          setMustSpin(false);
        }
      };

      requestAnimationFrame(animate);
    };

    // Initial draw
    drawWheel();

    // Handle spin
    if (mustSpin && !isSpinning.current) {
      isSpinning.current = true;
      spinWheel();
    }
  }, [prizes, mustSpin, setMustSpin, prizeNumber]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={400} height={400} className="mx-auto" />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: '40px solid #333',
        }}
      />
    </div>
  );
}

export default WheelCanvas;
