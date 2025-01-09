function LoadingOverlay({ loading, children }) {
  if (!loading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="mt-2 text-indigo-600">Đang xử lý...</span>
        </div>
      </div>
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  );
}

export default LoadingOverlay;
