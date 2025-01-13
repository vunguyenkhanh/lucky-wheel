import { useEffect, useState } from 'react';

function CountdownTimer({ expirationDate, onExpired }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState(-1); // Theo dõi chữ số đang flip
  const [retryCount, setRetryCount] = useState(0); // Thêm retry counter

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expirationDate).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setIsExpired(true);
        // Thử gọi onExpired tối đa 3 lần nếu thất bại
        if (onExpired && retryCount < 3) {
          onExpired().catch(() => {
            setRetryCount((prev) => prev + 1);
            // Thử lại sau 5 giây
            setTimeout(() => {
              onExpired().catch(console.error);
            }, 5000);
          });
        }
        return '00:00:00';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const newTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Tìm chữ số đầu tiên thay đổi để tạo hiệu ứng flip
      if (timeLeft && newTime !== timeLeft) {
        for (let i = 0; i < newTime.length; i++) {
          if (newTime[i] !== timeLeft[i]) {
            setFlippedIndex(i);
            break;
          }
        }
      }

      return newTime;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [expirationDate, onExpired, retryCount]);

  if (isExpired) {
    return <span className="text-red-500 font-medium">Đã hết hạn</span>;
  }

  return (
    <div className="flip-countdown inline-flex items-center gap-1">
      {timeLeft.split('').map((digit, index) => {
        if (digit === ':') {
          return (
            <span key={index} className="text-gray-400 mx-0.5">
              :
            </span>
          );
        }

        return (
          <div key={index} className="relative w-7 h-10 bg-gray-800 rounded-lg perspective-500">
            {/* Top card */}
            <div
              className={`absolute inset-0 w-full h-full flex items-center justify-center
              text-white font-mono text-xl rounded-lg shadow-inner
              ${flippedIndex === index ? 'animate-flip-down' : ''}`}
            >
              {digit}
            </div>

            {/* Bottom card */}
            <div
              className={`absolute inset-0 w-full h-full flex items-center justify-center
              bg-gray-700 text-white font-mono text-xl rounded-lg origin-top
              ${flippedIndex === index ? 'animate-flip-up' : ''}`}
            >
              {digit}
            </div>

            {/* Divider line */}
            <div className="absolute w-full h-px bg-black opacity-10 top-1/2 transform -translate-y-1/2" />
          </div>
        );
      })}
    </div>
  );
}

export default CountdownTimer;
