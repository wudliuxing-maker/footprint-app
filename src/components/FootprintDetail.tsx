import React, { memo } from 'react';
import { X, MapPin, Calendar, Image, Navigation } from 'lucide-react';
import { Footprint } from '../types/footprint';
import { maskLocation, maskCity, maskCoordinates, maskDate } from './PrivacyToggle';

interface FootprintDetailProps {
  footprint: Footprint;
  onClose: () => void;
  privacySettings?: {
    hideLocation: boolean;
    hideCity: boolean;
    hideCoordinates: boolean;
    hideDate: boolean;
  };
}

export const FootprintDetail: React.FC<FootprintDetailProps> = memo(({ 
  footprint, 
  onClose,
  privacySettings = {
    hideLocation: false,
    hideCity: false,
    hideCoordinates: false,
    hideDate: false,
  }
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (privacySettings.hideDate) {
      return `${date.getFullYear()}年`;
    }
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (privacySettings.hideDate) {
      return '';
    }
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayLocation = maskLocation(footprint.locationName, privacySettings.hideLocation);
  const displayCity = maskCity(footprint.city, privacySettings.hideCity);
  const displayCoords = maskCoordinates(footprint.latitude, footprint.longitude, privacySettings.hideCoordinates);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 - Instagram风格简洁设计 */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              {displayLocation}
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              {formatDate(footprint.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 地点信息 */}
          <div className="mb-5">
            <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
              {displayCity}
            </span>
            {footprint.note && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                {footprint.note}
              </p>
            )}
          </div>

          {/* 照片列表 - Instagram风格大图网格 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-gray-600" />
              照片 ({footprint.photos.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {footprint.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={`拍摄于${footprint.locationName}`}
                    className="w-full h-40 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
                    <p className="text-white text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(photo.takenAt)} {formatTime(photo.takenAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 坐标信息 */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Navigation className="w-3 h-3" />
              坐标: {displayCoords}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

FootprintDetail.displayName = 'FootprintDetail';
