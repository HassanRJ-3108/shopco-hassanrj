import React from 'react';

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full animate-pulse">
                <div className="bg-gray-300 rounded-t-lg w-full h-48"></div>
                <div className="p-4">
                    <div className="bg-gray-300 h-6 w-3/4 mb-4 rounded"></div>
                    <div className="flex items-center mt-2">
                        <div className="flex items-center space-x-1">
                            <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                            <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                            <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                            <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                            <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                        </div>
                        <div className="bg-gray-300 h-4 w-10 ml-2 rounded"></div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-end mt-2">
                            <div className="bg-gray-300 h-8 w-1/3 rounded mr-2"></div>
                            <div className="bg-gray-300 h-6 w-1/4 rounded mr-2"></div>
                            <div className="bg-gray-300 h-4 w-1/6 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;