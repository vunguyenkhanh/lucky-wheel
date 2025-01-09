import { useState } from 'react';
import Loading from '../components/common/Loading';
import LuckyWheel from '../components/wheel/LuckyWheel';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from '../hooks/useErrorHandler';

function Wheel() {
  const { loading } = useAuth(true);
  const { handleError } = useErrorHandler();
  const [error, setError] = useState(null);

  const handleSpin = async () => {
    try {
      await spinWheel();
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{error}</div>}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Vòng Quay May Mắn</h1>
      <LuckyWheel onSpin={handleSpin} />
    </div>
  );
}

export default Wheel;
