import { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

interface RegulationPopupProps {
  onClose: () => void;
}

export function RegulationPopup({ onClose }: RegulationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already read the regulation
    const hasReadRegulation = localStorage.getItem("hasReadRegulation");
    
    if (!hasReadRegulation) {
      // Show popup after a short delay for smooth animation
      setTimeout(() => setIsVisible(true), 300);
      // Prevent body scroll when popup is open
      document.body.classList.add("regulation-popup-open");
    }

    return () => {
      // Cleanup: restore body scroll
      document.body.classList.remove("regulation-popup-open");
    };
  }, []);

  const handleReadRegulation = () => {
    // Mark as read in localStorage
    localStorage.setItem("hasReadRegulation", "true");
    
    // Open regulation link in new tab
    window.open("https://regulasivol1.vercel.app/", "_blank");
    
    // Close popup
    setIsVisible(false);
    document.body.classList.remove("regulation-popup-open");
    
    // Notify parent component
    setTimeout(() => onClose(), 300);
  };

  // Don't render if already read
  const hasReadRegulation = localStorage.getItem("hasReadRegulation");
  if (hasReadRegulation) {
    return null;
  }

  return (
    <div 
      className={`regulation-popup-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Popup Container - Scrollable */}
      <div 
        className={`regulation-popup-container bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center rounded-t-2xl flex-shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Perhatian Penting!
          </h3>
          <p className="text-orange-100 text-sm">
            Wajib Baca Sebelum Mendaftar
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="regulation-popup-content p-6 space-y-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
            <h4 className="font-bold text-orange-800 text-base mb-3 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Regulasi Fun Bike Contest Vol 1
            </h4>
            <div className="space-y-2 text-sm text-orange-900">
              <p className="leading-relaxed">
                Sebelum melanjutkan pendaftaran, Anda <strong>WAJIB</strong> membaca dan memahami seluruh regulasi yang berlaku untuk acara ini.
              </p>
              <p className="leading-relaxed">
                Regulasi berisi informasi penting tentang:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ketentuan dan syarat peserta</li>
                <li>Kategori lomba</li>
                <li>Aturan penilaian</li>
                <li>Jadwal acara</li>
                <li>Hal-hal yang dilarang</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h5 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              Mengapa Harus Membaca?
            </h5>
            <p className="text-xs text-blue-700 leading-relaxed">
              Dengan membaca regulasi, Anda akan memahami semua aturan dan ketentuan yang berlaku. Ini akan membantu Anda mempersiapkan diri dengan baik dan menghindari diskualifikasi.
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <h5 className="font-semibold text-red-800 text-sm mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Penting untuk Diketahui
            </h5>
            <p className="text-xs text-red-700 leading-relaxed">
              Dengan melanjutkan pendaftaran, Anda dianggap telah membaca, memahami, dan menyetujui seluruh regulasi yang berlaku. Tidak ada alasan "tidak tahu" yang dapat diterima.
            </p>
          </div>
        </div>

        {/* Action Button - Fixed */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleReadRegulation}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Baca Regulasi Sekarang</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Klik tombol di atas untuk membuka halaman regulasi
          </p>
        </div>
      </div>
    </div>
  );
}
