import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    // Handle visibility based on scroll (Only show in Hero section)
    React.useEffect(() => {
        const handleScroll = () => {
            // Hide button if scrolled past 600px (approx Hero height)
            if (window.scrollY > 600) {
                setIsVisible(false);
                setIsOpen(false); // Close menu if hiding
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            {/* Menu Options (Show when open) */}
            <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>

                {/* Call Button */}
                <a
                    href="tel:112"
                    className="flex items-center gap-3 bg-rose-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-rose-700 transition transform hover:scale-105"
                >
                    <span className="font-bold text-sm">Panggilan Darurat</span>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="bi bi-telephone-fill text-xl"></i>
                    </div>
                </a>

                {/* Report Button */}
                <button
                    onClick={() => navigate('/laporkan')}
                    className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
                >
                    <span className="font-bold text-sm">Buat Laporan</span>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="bi bi-file-earmark-text-fill text-xl"></i>
                    </div>
                </button>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-45' : 'bg-rose-600 hover:scale-110 animate-pulse-fast'}`}
            >
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-exclamation-triangle-fill'} text-3xl text-white`}></i>

                {/* Ping Animation Effect */}
                {!isOpen && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                )}
            </button>
        </div>
    );
};

export default FloatingButton;
