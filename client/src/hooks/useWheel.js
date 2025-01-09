import { useCallback, useState } from 'react';
import { useWheelStore } from '../store/wheelStore';

export const useWheel = () => {
  const { prizes, spinResult, spinning, spin } = useWheelStore();
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSpin = useCallback(async () => {
    if (spinning) return;

    try {
      setLoading(true);
      const result = await spin();
      const targetIndex = prizes.findIndex((p) => p.id === result.id);
      const spins = 5;
      const targetRotation = 360 * spins + (360 / prizes.length) * targetIndex;
      const duration = 3000; // 3 seconds
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const currentRotation = easeOut(progress) * targetRotation;

        if (progress < 1) {
          setRotation(currentRotation);
          requestAnimationFrame(animate);
        } else {
          setRotation(targetRotation);
          setShowResult(true);
        }
      };

      requestAnimationFrame(animate);

      return result;
    } catch (error) {
      console.error('Spin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [prizes, spinning, spin, rotation]);

  const resetWheel = useCallback(() => {
    setRotation(0);
    setShowResult(false);
  }, []);

  return {
    prizes,
    spinResult,
    spinning,
    rotation,
    showResult,
    handleSpin,
    resetWheel,
    setShowResult,
    loading,
  };
};
