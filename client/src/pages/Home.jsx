function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">
        Chào mừng đến với SoundHub Lucky Wheel
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Tham gia ngay để có cơ hội nhận những phần quà hấp dẫn từ SoundHub
      </p>
      <img
        src="/assets/images/banner.jpg"
        alt="Lucky Wheel Banner"
        className="rounded-lg shadow-lg w-full"
      />
    </div>
  );
}

export default Home;
