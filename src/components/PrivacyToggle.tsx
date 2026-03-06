import React from 'react';
import { Eye, EyeOff, Shield, MapPin, Calendar } from 'lucide-react';

interface PrivacySettings {
  hideLocation: boolean;
  hideCity: boolean;
  hideCoordinates: boolean;
  hideDate: boolean;
}

interface PrivacyToggleProps {
  settings: PrivacySettings;
  onChange: (settings: PrivacySettings) => void;
}

export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ settings, onChange }) => {
  const toggles = [
    { key: 'hideLocation', label: '隐藏地点名称', icon: MapPin },
    { key: 'hideCity', label: '隐藏城市', icon: Shield },
    { key: 'hideCoordinates', label: '隐藏坐标', icon: MapPin },
    { key: 'hideDate', label: '隐藏日期', icon: Calendar },
  ] as const;

  const handleToggle = (key: keyof PrivacySettings) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <EyeOff className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">隐私保护</h3>
      </div>
      <div className="space-y-2.5">
        {toggles.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleToggle(key)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              settings[key]
                ? 'bg-gray-100 border border-gray-300'
                : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
            }`}
          >
            <span className={`flex items-center gap-2 text-sm font-medium ${settings[key] ? 'text-gray-900' : 'text-gray-600'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </span>
            <div
              className={`w-11 h-6 rounded-full transition-all relative ${
                settings[key] ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings[key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        开启后将隐藏对应的敏感信息
      </p>
    </div>
  );
};

// 隐私保护工具函数
export const maskLocation = (name: string, hide: boolean): string => {
  if (!hide || !name) return name;
  if (name.length <= 2) return '***';
  return name.charAt(0) + '*'.repeat(name.length - 1);
};

export const maskCity = (city: string, hide: boolean): string => {
  if (!hide || !city) return city;
  if (city.length <= 2) return '***';
  return city.charAt(0) + '*'.repeat(city.length - 1);
};

export const maskCoordinates = (lat: number, lng: number, hide: boolean): string => {
  if (!hide) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  return `${lat.toFixed(1)}**, ***`;
};

export const maskDate = (date: string, hide: boolean): string => {
  if (!hide) return date;
  const d = new Date(date);
  return `${d.getFullYear()}年**月**日`;
};
