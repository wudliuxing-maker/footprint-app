import { useState, useRef } from 'react';
import { Download, Share2, Heart, MessageCircle, MapPin, Calendar, ChevronDown, X } from 'lucide-react';
import { Footprint, CATEGORY_OPTIONS } from '../types/footprint';

interface SharePosterPageProps {
  footprints: Footprint[];
}

export function SharePosterPage({ footprints }: SharePosterPageProps) {
  const [selectedFootprint, setSelectedFootprint] = useState<Footprint | null>(footprints[0] || null);
  const [showSelector, setShowSelector] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (category: string) => 
    CATEGORY_OPTIONS.find(c => c.value === category)?.icon || '📌';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleShare = async () => {
    if (!selectedFootprint) return;
    // 模拟分享功能
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我在${selectedFootprint.locationName}的足迹`,
          text: selectedFootprint.note || `探索${selectedFootprint.locationName}，留下美好回忆！`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    }
  };

  const handleDownload = () => {
    // 模拟下载
    console.log('下载海报');
  };

  if (!selectedFootprint) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无足迹可分享</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 选择足迹 */}
      <div className="relative">
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            {selectedFootprint.photos[0] ? (
              <img src={selectedFootprint.photos[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold">{selectedFootprint.locationName}</h3>
            <p className="text-sm text-gray-500">{selectedFootprint.city} · {selectedFootprint.createdAt}</p>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
        
        {showSelector && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg z-10 max-h-64 overflow-y-auto">
            {footprints.map(fp => (
              <button
                key={fp.id}
                onClick={() => {
                  setSelectedFootprint(fp);
                  setShowSelector(false);
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 text-left"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {fp.photos[0] ? (
                    <img src={fp.photos[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{fp.locationName}</h4>
                  <p className="text-xs text-gray-500">{fp.city}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 海报预览 */}
      <div 
        ref={posterRef}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden text-white"
      >
        {/* 封面图 */}
        <div className="h-56 overflow-hidden relative">
          {selectedFootprint.photos[0] ? (
            <img 
              src={selectedFootprint.photos[0].url} 
              alt={selectedFootprint.locationName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-gray-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* 内容 */}
        <div className="p-5">
          {/* 分类图标 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getCategoryIcon(selectedFootprint.category)}</span>
            <span className="text-sm text-gray-400">
              {CATEGORY_OPTIONS.find(c => c.value === selectedFootprint.category)?.label}
            </span>
          </div>

          {/* 地点名称 */}
          <h3 className="text-2xl font-bold mb-2">{selectedFootprint.locationName}</h3>
          
          {/* 城市 */}
          <div className="flex items-center gap-1 text-gray-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{selectedFootprint.city}</span>
          </div>

          {/* 笔记 */}
          {selectedFootprint.note && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{selectedFootprint.note}</p>
          )}

          {/* 标签 */}
          {selectedFootprint.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFootprint.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 日期和统计 */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(selectedFootprint.createdAt)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{selectedFootprint.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{selectedFootprint.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-2xl font-medium hover:bg-black/90 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          分享
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
        >
          <Download className="w-5 h-5" />
          下载
        </button>
      </div>
    </div>
  );
}
