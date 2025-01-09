function Skeleton({ className = '', count = 1 }) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={`animate-pulse bg-gray-200 rounded ${className}`} />
    ));
}

export default Skeleton;
