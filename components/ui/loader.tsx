export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Plant Icon */}
        <div className="relative mb-8">
          <div className="text-6xl animate-bounce">🌱</div>
          <div className="absolute inset-0 text-6xl animate-pulse opacity-50">
            🌿
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin mx-auto opacity-50"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Loading Your Profile
        </h2>
        <p className="text-gray-600">Preparing your farming profile...</p>

        {/* Loading Dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
