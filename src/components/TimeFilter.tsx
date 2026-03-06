import React from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface TimeFilterProps {
  years: number[];
  months: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  onYearChange: (year: number | null) => void;
  onMonthChange: (month: number | null) => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  years,
  months,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-black text-lg">时间筛选</span>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* 年份选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500 font-medium">年份</label>
          <div className="relative">
            <select
              value={selectedYear ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onYearChange(value ? parseInt(value) : null);
              }}
              className="appearance-none bg-gray-100 border-0 rounded-xl px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer min-w-[140px]"
            >
              <option value="">全部</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* 月份选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500 font-medium">月份</label>
          <div className="relative">
            <select
              value={selectedMonth ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onMonthChange(value ? parseInt(value) : null);
              }}
              disabled={!selectedYear}
              className="appearance-none bg-gray-100 border-0 rounded-xl px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              <option value="">全部</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {monthNames[month - 1]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* 重置按钮 */}
        {(selectedYear || selectedMonth) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                onYearChange(null);
                onMonthChange(null);
              }}
              className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              清除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
