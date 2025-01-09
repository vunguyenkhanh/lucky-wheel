import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/common/LoadingOverlay';
import WheelCanvas from '../components/wheel/WheelCanvas';
import { useToast } from '../contexts/ToastContext';
import { useLoading } from '../hooks/useLoading';
import { usePrizeStore } from '../store/prizeStore';
import { useWheelStore } from '../store/wheelStore';

function Wheel() {
  const { showToast } = useToast();
  const [mustSpin, setMustSpin] = useState(false);
  const { loading, withLoading } = useLoading();

  const { spinning, result, history, spin, fetchHistory, checkEligibility } = useWheelStore();

  const { prizes, loading: prizesLoading, fetchPrizes } = usePrizeStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPrizes(), fetchHistory()]);
      } catch (error) {
        showToast(error.message, 'error');
      }
    };
    loadData();
  }, [fetchPrizes, fetchHistory, showToast]);

  const handleSpin = async () => {
    try {
      await withLoading(async () => {
        const canSpin = await checkEligibility();
        if (!canSpin) {
          showToast('Bạn đã hết lượt quay', 'error');
          return;
        }

        setMustSpin(true);
        const spinResult = await spin();
        showToast(`Chúc mừng! Bạn đã trúng ${spinResult.prize.name}`, 'success');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <LoadingOverlay loading={loading || prizesLoading || spinning}>
      <div className="container mx-auto p-4">
        <WheelCanvas
          prizes={prizes}
          mustSpin={mustSpin}
          setMustSpin={setMustSpin}
          prizeNumber={result?.prizeIndex}
        />

        <button
          onClick={handleSpin}
          disabled={spinning || mustSpin}
          className="btn btn-primary mt-4"
        >
          {spinning ? 'Đang quay...' : 'Quay thưởng'}
        </button>

        {/* History section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Lịch sử quay thưởng</h2>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded shadow">
                <p>Giải thưởng: {item.prize.name}</p>
                <p>Thời gian: {new Date(item.spinTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Wheel;
