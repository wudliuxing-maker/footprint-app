import React, { memo, useMemo } from 'react';
import { MapPin, Calendar, Image, ChevronRight, Clock } from 'lucide-react';
import { Footprint } from '../types/footprint';

interface TimelineProps {
  footprints: Footprint[];
  onItemClick: (footprint: Footprint) => void;
}

// 使用 memo 优化时间线渲染性能
export const Timeline: React.FC<TimelineProps> = memo(({ footprints, onItemClick }) => {
  // 使用 useMemo 缓存排序和分组结果
  const { sortedFootprints, groupedFootprints, stats } = useMemo(() => {
    // 按时间排序（从新到旧）
    const sorted = [...footprints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 按年月分组
    const grouped = sorted.reduce((groups, footprint) => {
      const date = new Date(footprint.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(footprint);
      return groups;
    }, {} as Record<string, Footprint[]>);

    return {
      sortedFootprints: sorted,
      groupedFootprints: grouped,
      stats: {
        totalFootprints: footprints.length,
        totalMonths: Object.keys(grouped).length,
      }
    };
  }, [footprints]);

  // 获取分组的时间标签
  const getTimeLabel = useMemo(() => (key: string) => {
    const [year, month] = key.split('-');
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return `${year}年 ${monthNames[parseInt(month) - 1]}`;
  }, []);

  const formatDate = useMemo(() => (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formatFullDate = useMemo(() => (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  if (footprints.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
        <Clock className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-700 font-medium text-lg">暂无足迹记录</p>
        <p className="text-sm text-gray-400 mt-2">选择筛选条件查看更多足迹</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 时间线统计 - Instagram风格卡片 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-black">{stats.totalFootprints}</p>
            <p className="text-sm text-gray-500 mt-1">个足迹点</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-black">{stats.totalMonths}</p>
            <p className="text-sm text-gray-500 mt-1">个月份</p>
          </div>
        </div>
      </div>

      {/* 时间线内容 */}
      <div className="relative">
        {/* 时间线竖线 - 简洁灰色 */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

        {Object.entries(groupedFootprints).map(([key, groupFootprints]) => (
          <TimelineGroup 
            key={key} 
            keyStr={key} 
            groupFootprints={groupFootprints}
            onItemClick={onItemClick}
            getTimeLabel={getTimeLabel}
            formatFullDate={formatFullDate}
          />
        ))}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

// 时间线分组组件
interface TimelineGroupProps {
  keyStr: string;
  groupFootprints: Footprint[];
  onItemClick: (footprint: Footprint) => void;
  getTimeLabel: (key: string) => string;
  formatFullDate: (dateStr: string) => string;
}

const TimelineGroup: React.FC<TimelineGroupProps> = memo(({
  keyStr,
  groupFootprints,
  onItemClick,
  getTimeLabel,
  formatFullDate,
}) => (
  <div className="relative mb-10">
    {/* 时间标签 - Instagram风格简洁设计 */}
    <div className="flex items-center mb-5">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-black font-bold text-xl shadow-sm">
        {keyStr.split('-')[1]}
      </div>
      <div className="ml-5">
        <p className="text-xl font-semibold text-black">{getTimeLabel(keyStr)}</p>
        <p className="text-sm text-gray-500 mt-1">{groupFootprints.length}次出行</p>
      </div>
    </div>

    {/* 该月的足迹列表 */}
    <div className="ml-7 space-y-4">
      {groupFootprints.map((footprint) => (
        <TimelineItem 
          key={footprint.id} 
          footprint={footprint} 
          onItemClick={onItemClick}
          formatFullDate={formatFullDate}
        />
      ))}
    </div>
  </div>
));

TimelineGroup.displayName = 'TimelineGroup';

// 时间线项组件 - Instagram风格大卡片
interface TimelineItemProps {
  footprint: Footprint;
  onItemClick: (footprint: Footprint) => void;
  formatFullDate: (dateStr: string) => string;
}

const TimelineItem: React.FC<TimelineItemProps> = memo(({ footprint, onItemClick, formatFullDate }) => (
  <div
    onClick={() => onItemClick(footprint)}
    className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-start gap-4 p-5">
      {/* 缩略图 - 圆角大图 */}
      <div className="flex-shrink-0">
        <img
          src={footprint.photos[0]?.url}
          alt={footprint.locationName}
          className="w-32 h-32 object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-black truncate text-lg">
            {footprint.locationName}
          </h3>
          <span className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium">
            {footprint.city}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatFullDate(footprint.createdAt)}</span>
        </div>

        {footprint.note && (
          <p className="text-sm text-gray-500 mt-3 line-clamp-2">{footprint.note}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Image className="w-4 h-4" />
            {footprint.photos.length}张照片
          </div>
          <div className="flex items-center gap-1 text-black text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            查看详情
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

TimelineItem.displayName = 'TimelineItem';
