import { useRef } from 'react';
import { X, Download, Share2, Heart, MessageCircle, MapPin, Calendar } from 'lucide-react';
import { Footprint, CATEGORY_OPTIONS } from '../types/footprint';

interface SharePosterProps {
  footprint: Footprint;
  onClose: () => void;
  onDownload?: () => void;
}

export function SharePoster({ footprint, onClose, onDownload }: SharePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (category: string) => 
    CATEGORY_OPTIONS.find(c => c.value === category)?.icon || '📌';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleShare = async () => {
    // 模拟分享功能
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我在${footprint.locationName}的足迹`,
          text: footprint.note || `探索${footprint.locationName}，留下美好回忆！`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">分享海报</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 海报内容 */}
        <div className="p-5">
          <div 
            ref={posterRef}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden text-white"
          >
            {/* 封面图 */}
            <div className="h-48 overflow-hidden">
              {footprint.photos[0] ? (
                <img 
                  src={footprint.photos[0].url} 
                  alt={footprint.locationName}
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
                <span className="text-2xl">{getCategoryIcon(footprint.category)}</span>
                <span className="text-sm text-gray-400">
                  {CATEGORY_OPTIONS.find(c => c.value === footprint.category)?.label}
                </span>
              </div>

              {/* 地点名称 */}
              <h3 className="text-2xl font-bold mb-2">{footprint.locationName}</h3>
              
              {/* 城市 */}
              <div className="flex items-center gap-1 text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{footprint.city}</span>
              </div>

              {/* 笔记 */}
              {footprint.note && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{footprint.note}</p>
              )}

              {/* 标签 */}
              {footprint.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {footprint.tags.map(tag => (
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
                  <span className="text-sm">{formatDate(footprint.createdAt)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{footprint.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{footprint.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-2xl font-medium hover:bg-black/90 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              分享
            </button>
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
