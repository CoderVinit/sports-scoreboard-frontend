const CricketLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      {/* Cricket Ball Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">⚾</span>
        </div>
      </div>
      
      {/* Loading Text */}
      
    </div>
  );
};

export default CricketLoader;

