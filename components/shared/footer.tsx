export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 border-t border-green-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">F8</span>
              </div>
              <h3 className="text-2xl font-bold text-white">FAM 8</h3>
            </div>
            <p className="text-green-200 text-sm font-medium">
              Growing wealth through smart farming
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-green-800/60 backdrop-blur-sm border border-green-600/40 rounded-full px-6 py-3 hover:bg-green-700/60 transition-all duration-300 group shadow-lg">
            <span className="text-sm font-semibold text-green-100 group-hover:text-white transition-colors duration-300">
              Made in 9ja
            </span>
            <div className="flex flex-col w-6 h-4 rounded-sm overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300 border border-green-600/30">
              <div className="w-full h-1/3 bg-green-500"></div>
              <div className="w-full h-1/3 bg-white"></div>
              <div className="w-full h-1/3 bg-green-600"></div>
            </div>
            <span className="text-lg animate-pulse">🇳🇬</span>
          </div>

          <div className="flex flex-col items-center lg:items-end space-y-3">
            <div className="flex space-x-6 text-sm text-green-200">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:underline"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:underline"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300 hover:underline"
              >
                Support
              </a>
            </div>
            <div className="text-green-300 text-sm">
              © 2025 FAM 8. All rights reserved.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-green-700/30">
          <div className="text-center">
            <p className="text-green-300 text-xs">
              🌱 Empowering farmers, investors, and communities through
              innovative land investment opportunities. 🌾
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
