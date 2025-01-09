import { useCallback, useState } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const withLoading = useCallback(async (callback) => {
    setLoading(true);
    setError(null);
    try {
      const result = await callback();
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, withLoading };
};
