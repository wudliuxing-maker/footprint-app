import React, { memo, useMemo } from 'react';
import { MapPin, Calendar, Image } from 'lucide-react';
import { Footprint } from '../types/footprint';

interface FootprintListProps {
  footprints: Footprint[];
  onItemClick: (footprint: Footprint) => void;
}

// 使用 memo 优化列表渲染性能
export const FootprintList: React.FC<FootprintListProps> = memo(({ footprints, onItemClick }) => {
  const formatDate = useMemo(() => (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  if (footprints.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">暂无足迹记录</p>
        <p className="text-sm text-gray-400 mt-1">选择筛选条件查看更多足迹</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {footprints.map((footprint) => (
        <ListItem 
          key={footprint.id} 
          footprint={footprint} 
          onItemClick={onItemClick}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
});

FootprintList.displayName = 'FootprintList';

// 独立的列表项组件，使用 memo 优化 - Instagram风格
interface ListItemProps {
  footprint: Footprint;
  onItemClick: (footprint: Footprint) => void;
  formatDate: (dateStr: string) => string;
}

const ListItem: React.FC<ListItemProps> = memo(({ footprint, onItemClick, formatDate }) => (
  <div
    onClick={() => onItemClick(footprint)}
    className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
  >
    <div className="flex gap-4">
      {/* 缩略图 - 使用 lazy loading */}
      <div className="flex-shrink-0">
        <img
          src={footprint.photos[0]?.url}
          alt={footprint.locationName}
          className="w-20 h-20 object-cover rounded-xl"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {footprint.locationName}
          </h3>
          <span className="flex-shrink-0 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {footprint.city}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(footprint.createdAt)}
        </div>

        {footprint.note && (
          <p className="text-sm text-gray-500 mt-1.5 truncate">{footprint.note}</p>
        )}

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <Image className="w-3.5 h-3.5" />
          {footprint.photos.length}张照片
        </div>
      </div>
    </div>
  </div>
));

ListItem.displayName = 'ListItem';
