import { Footprint } from '../types/footprint';
import { BarChart3, TrendingUp, MapPin, Calendar, Clock, Globe } from 'lucide-react';

interface StatsProps {
  footprints: Footprint[];
}

export function Stats({ footprints }: StatsProps) {
  // 计算统计数据
  const totalFootprints = footprints.length;
  
  // 城市统计
  const cityStats = footprints.reduce((acc, fp) => {
    acc[fp.city] = (acc[fp.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCities = Object.entries(cityStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 年份统计
  const yearStats = footprints.reduce((acc, fp) => {
    const year = new Date(fp.createdAt).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topYears = Object.entries(yearStats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 5);

  // 月份统计
  const monthStats = footprints.reduce((acc, fp) => {
    const month = new Date(fp.createdAt).getMonth() + 1;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const topMonths = Object.entries(monthStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 首次和最后一次足迹
  const sortedByDate = [...footprints].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const firstFootprint = sortedByDate[0];
  const lastFootprint = sortedByDate[sortedByDate.length - 1];

  // 总天数
  const daysDiff = firstFootprint && lastFootprint 
    ? Math.ceil((new Date(lastFootprint.createdAt).getTime() - new Date(firstFootprint.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* 统计概览 - Instagram风格简洁卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">总足迹</span>
          </div>
          <p className="text-4xl font-bold text-black">{totalFootprints}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">覆盖城市</span>
          </div>
          <p className="text-4xl font-bold text-black">{Object.keys(cityStats).length}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">首次记录</span>
          </div>
          <p className="text-2xl font-bold text-black">
            {firstFootprint ? new Date(firstFootprint.createdAt).getFullYear() : '-'}
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">跨越天数</span>
          </div>
          <p className="text-4xl font-bold text-black">{daysDiff}</p>
        </div>
      </div>

      {/* 城市排名 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-black" />
          <h3 className="font-semibold text-black text-lg">足迹最多的城市</h3>
        </div>
        {topCities.length > 0 ? (
          <div className="space-y-5">
            {topCities.map(([city, count], index) => (
              <div key={city} className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-black text-white' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  index === 2 ? 'bg-gray-200 text-gray-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black font-medium">{city}</span>
                    <span className="text-gray-500 text-sm">{count} 次</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full"
                      style={{ width: `${(count / topCities[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">暂无数据</p>
        )}
      </div>

      {/* 年份分布 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-black" />
          <h3 className="font-semibold text-black text-lg">年度足迹</h3>
        </div>
        {topYears.length > 0 ? (
          <div className="space-y-4">
            {topYears.map(([year, count]) => (
              <div key={year} className="flex items-center gap-4">
                <span className="w-14 text-gray-600 font-medium">{year}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full flex items-center justify-end pr-4"
                    style={{ width: `${(count / Math.max(...Object.values(yearStats))) * 100}%` }}
                  >
                    <span className="text-white text-sm font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">暂无数据</p>
        )}
      </div>

      {/* 最常去月份 */}
      {topMonths.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-black" />
            <h3 className="font-semibold text-black text-lg">最常出行月份</h3>
          </div>
          <div className="flex gap-4">
            {topMonths.map(([month, count], index) => (
              <div key={month} className={`flex-1 p-5 rounded-2xl text-center ${
                index === 0 ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}>
                <p className="text-xl font-bold">{monthNames[parseInt(month) - 1]}</p>
                <p className={`text-sm mt-1 ${index === 0 ? 'text-gray-300' : 'text-gray-500'}`}>{count} 次</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
