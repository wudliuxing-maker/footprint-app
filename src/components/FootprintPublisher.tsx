import { useState, useRef } from 'react';
import { X, Upload, MapPin, Tag as TagIcon, Image, Calendar, ChevronDown } from 'lucide-react';
import { TAG_OPTIONS, CATEGORY_OPTIONS, FootprintCategory } from '../types/footprint';

interface FootprintPublisherProps {
  onPublish: (data: PublishData) => void;
  onClose: () => void;
}

export interface PublishData {
  locationName: string;
  city: string;
  latitude: number;
  longitude: number;
  note: string;
  tags: string[];
  category: FootprintCategory;
  photos: string[];
}

interface LocationData {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

export function FootprintPublisher({ onPublish, onClose }: FootprintPublisherProps) {
  const [step, setStep] = useState<'location' | 'content'>('location');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState<FootprintCategory>('other');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟位置搜索
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationData[]>([
    { name: '外滩', city: '上海', latitude: 31.2405, longitude: 121.4901 },
    { name: '西湖', city: '杭州', latitude: 30.2468, longitude: 120.1377 },
    { name: '故宫', city: '北京', latitude: 39.9163, longitude: 116.3972 },
    { name: '宽窄巷子', city: '成都', latitude: 30.6738, longitude: 104.0668 },
    { name: '张家界', city: '张家界', latitude: 29.1173, longitude: 110.4792 },
  ]);

  const handleLocationSelect = (loc: LocationData) => {
    setLocation(loc);
    setStep('content');
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag].slice(0, 5) // 最多5个标签
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 模拟上传，实际应该上传到服务器
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 9)); // 最多9张
    }
  };

  const handlePublish = () => {
    if (!location) return;
    onPublish({
      locationName: location.name,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      note,
      tags: selectedTags,
      category,
      photos,
    });
  };

  const getCategoryIcon = (cat: FootprintCategory) => 
    CATEGORY_OPTIONS.find(c => c.value === cat)?.icon || '📌';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {step === 'location' ? '选择地点' : '发布足迹'}
          </h2>
          <button 
            onClick={step === 'location' ? onClose : handlePublish}
            className="text-black font-medium"
          >
            {step === 'location' ? '取消' : '发布'}
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          {step === 'location' ? (
            <div className="p-5">
              {/* 搜索框 */}
              <div className="relative mb-4">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="搜索地点..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* 位置列表 */}
              <div className="space-y-2">
                {locationResults
                  .filter(loc => 
                    !locationQuery || 
                    loc.name.includes(locationQuery) || 
                    loc.city.includes(locationQuery)
                  )
                  .map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationSelect(loc)}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{loc.name}</h3>
                        <p className="text-sm text-gray-500">{loc.city}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* 已选地点 */}
              {location && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{location.name}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{location.city}</span>
                  <button 
                    onClick={() => setStep('location')}
                    className="ml-auto text-sm text-gray-400 hover:text-black"
                  >
                    修改
                  </button>
                </div>
              )}

              {/* 分类选择 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">分类</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-left"
                  >
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <span className="flex-1">{CATEGORY_OPTIONS.find(c => c.value === category)?.label}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  {showCategoryPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg z-10 overflow-hidden">
                      {CATEGORY_OPTIONS.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            setCategory(cat.value);
                            setShowCategoryPicker(false);
                          }}
                          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left"
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 文字内容 */}
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="记录你的足迹..."
                  className="w-full p-4 bg-gray-50 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20 min-h-[120px]"
                  maxLength={500}
                />
                <p className="text-right text-xs text-gray-400 mt-1">{note.length}/500</p>
              </div>

              {/* 标签选择 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">标签</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">选择1-5个标签</p>
              </div>

              {/* 照片上传 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">照片</label>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 9 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <Image className="w-6 h-6" />
                      <span className="text-xs">{photos.length}/9</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {step === 'content' && (
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={handlePublish}
              disabled={!location}
              className="w-full py-4 bg-black text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/90 transition-colors"
            >
              发布足迹
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
