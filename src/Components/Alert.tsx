import React, { useEffect, useState } from 'react';

interface AlertProps {
    message: string;
    isVisible: boolean;
    onClose?: () => void;
    autoCloseTime?: number; // in milliseconds, default 5000ms
}

const Alert: React.FC<AlertProps> = ({ 
    message, 
    isVisible, 
    onClose, 
    autoCloseTime = 8000 
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            
            // Auto close timer
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseTime);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseTime]);

    const handleClose = () => {
        setIsAnimating(false);
        // Wait for fade out animation before calling onClose
        if(onClose){
            setTimeout(() => {
                onClose();
            }, 300);
        }
         // Match the transition duration
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop blur */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleClose}
            />
            
            {/* Alert component */}
            <div 
                className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-black shadow-2xl rounded-lg p-4 pr-12 z-50 min-w-80 max-w-md transition-all duration-300 ${
                    isAnimating 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 -translate-y-4 scale-95'
                }`}
            >
                {/* Message */}
                <div className="text-sm font-medium">
                    {message}
                </div>
                
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label="Close alert"
                >
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                        />
                    </svg>
                </button>

                {/* Progress bar for auto-close */}
                <div className="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden w-full">
                    <div 
                        className={`h-full bg-gray-400 transition-all ease-linear ${
                            isAnimating ? 'w-0' : 'w-full'
                        }`}
                        style={{ 
                            transitionDuration: isAnimating ? `${autoCloseTime}ms` : '0ms' 
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Alert;