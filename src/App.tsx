import { useState, useMemo, useCallback, useEffect } from 'react';
import { Footprint, Trip } from './types/footprint';
import { mockFootprints, getAvailableYears, getAvailableMonths } from './data/footprints';
import { FootprintMap } from './components/FootprintMap';
import { FootprintDetail } from './components/FootprintDetail';
import { FootprintList } from './components/FootprintList';
import { Timeline } from './components/Timeline';
import { TimeFilter } from './components/TimeFilter';
import { SearchBar } from './components/SearchBar';
import { ExportToImage } from './components/ExportToImage';
import { PrivacyToggle } from './components/PrivacyToggle';
import { Stats } from './components/Stats';
import { Profile } from './components/Profile';
import { TripPlanner } from './components/TripPlanner';
import { SharePosterPage } from './components/SharePosterPage';
import { FootprintPublisher, PublishData } from './components/FootprintPublisher';
import { 
  Footprints, Map as MapIcon, List, Flame, Clock, BarChart3, User, Shield,
  Calendar, Plus, Search, Layers, Filter, X
} from 'lucide-react';

export type TabType = 'home' | 'timeline' | 'stats' | 'profile';
export type MapMode = 'markers' | 'heatmap';
export type SubFeatureType = 'publisher' | 'search' | 'trip' | 'poster' | null;

interface PrivacySettings {
  hideLocation: boolean;
  hideCity: boolean;
  hideCoordinates: boolean;
  hideDate: boolean;
}

function App() {
  // 状态管理
  const [selectedFootprint, setSelectedFootprint] = useState<Footprint | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSubFeature, setActiveSubFeature] = useState<SubFeatureType>(null);
  const [mapMode, setMapMode] = useState<MapMode>('markers');
  const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);
  const [showPublisher, setShowPublisher] = useState(false);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    hideLocation: false,
    hideCity: false,
    hideCoordinates: false,
    hideDate: false,
  });
  
  // 地图控件状态
  const [showMapSearch, setShowMapSearch] = useState(false);
  const [showMapFilter, setShowMapFilter] = useState(false);

  // 获取可用年份 - 使用useMemo缓存
  const availableYears = useMemo(() => getAvailableYears(mockFootprints), []);
  
  // 获取可用月份（根据选中年份）- 使用useMemo缓存
  const availableMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getAvailableMonths(mockFootprints, selectedYear);
  }, [selectedYear]);

  // 筛选足迹 - 使用useMemo缓存，避免不必要的重计算
  const filteredFootprints = useMemo(() => {
    return mockFootprints.filter((fp) => {
      // 时间筛选
      if (selectedYear) {
        const fpYear = new Date(fp.createdAt).getFullYear();
        if (fpYear !== selectedYear) return false;
        
        if (selectedMonth) {
          const fpMonth = new Date(fp.createdAt).getMonth() + 1;
          if (fpMonth !== selectedMonth) return false;
        }
      }

      // 搜索筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        // 应用隐私设置后进行搜索
        const searchLocation = privacySettings.hideLocation 
          ? fp.locationName.charAt(0) + '*'.repeat(fp.locationName.length - 1)
          : fp.locationName;
        const searchCity = privacySettings.hideCity
          ? fp.city.charAt(0) + '*'.repeat(fp.city.length - 1)
          : fp.city;
        
        const matchLocation = searchLocation.toLowerCase().includes(query);
        const matchCity = searchCity.toLowerCase().includes(query);
        if (!matchLocation && !matchCity) return false;
      }

      return true;
    });
  }, [selectedYear, selectedMonth, searchQuery, privacySettings]);

  // 处理标记点点击 - 使用useCallback避免不必要的重渲染
  const handleMarkerClick = useCallback((footprint: Footprint) => {
    setSelectedFootprint(footprint);
  }, []);

  // 处理列表项点击 - 使用useCallback
  const handleListItemClick = useCallback((footprint: Footprint) => {
    setSelectedFootprint(footprint);
  }, []);

  // 处理年份变化 - 使用useCallback
  const handleYearChange = useCallback((year: number | null) => {
    setSelectedYear(year);
    // 清除月份选择（因为年份变了）
    if (year) {
      setSelectedMonth(null);
    }
  }, []);

  // 清除筛选 - 使用useCallback
  const handleClearFilters = useCallback(() => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSearchQuery('');
  }, []);

  // 关闭详情弹窗 - 使用useCallback
  const handleCloseDetail = useCallback(() => {
    setSelectedFootprint(null);
  }, []);

  // 处理隐私设置变化 - 使用useCallback
  const handlePrivacyChange = useCallback((newSettings: PrivacySettings) => {
    setPrivacySettings(newSettings);
  }, []);

  // 处理发布新足迹
  const handlePublish = useCallback((data: PublishData) => {
    const newFootprint: Footprint = {
      id: `fp_${Date.now()}`,
      locationName: data.locationName,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      photos: data.photos.map((url, idx) => ({
        id: `photo_${Date.now()}_${idx}`,
        url,
        takenAt: new Date().toISOString(),
        footprintId: `fp_${Date.now()}`,
      })),
      createdAt: new Date().toISOString().split('T')[0],
      note: data.note,
      tags: data.tags,
      likes: 0,
      isLiked: false,
      comments: [],
      isBookmarked: false,
      category: data.category,
    };
    // 将新足迹添加到列表（这里应该更新状态，实际项目应该发送到后端）
    console.log('发布新足迹:', newFootprint);
    setShowPublisher(false);
  }, []);

  // 处理保存行程
  const handleSaveTrip = useCallback((trip: Trip) => {
    setMyTrips(prev => {
      const existing = prev.findIndex(t => t.id === trip.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = trip;
        return updated;
      }
      return [...prev, trip];
    });
  }, []);

  // 性能优化：使用Intersection Observer懒加载图片
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => {
      observer.observe(img);
    });

    return () => observer.disconnect();
  }, [filteredFootprints]);

  // Tab配置 - 只保留4个底Tab
  const tabs = [
    { id: 'home' as const, label: '首页', icon: MapIcon },
    { id: 'timeline' as const, label: '时间线', icon: Clock },
    { id: 'stats' as const, label: '统计', icon: BarChart3 },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  // 渲染首页内容 - 简化版：仅地图+发布按钮
  const renderHomeContent = () => (
    <>
      {/* 地图 - 占据主要区域 */}
      <div className="h-[calc(100vh-180px)] min-h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
        <FootprintMap
          footprints={filteredFootprints}
          onMarkerClick={handleMarkerClick}
          selectedFootprint={selectedFootprint}
          mode={mapMode}
        />
        
        {/* 地图右上角控件 - 类似地图App布局 */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          {/* 搜索图标 */}
          <button
            onClick={() => {
              setShowMapSearch(!showMapSearch);
              setShowMapFilter(false);
            }}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-all ${
              showMapSearch || searchQuery
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="搜索"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* 地图模式切换 */}
          <button
            onClick={() => setMapMode(mapMode === 'markers' ? 'heatmap' : 'markers')}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-all ${
              mapMode === 'heatmap'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title={mapMode === 'markers' ? '切换热力图' : '切换标记'}
          >
            {mapMode === 'markers' ? <Layers className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
          </button>
          
          {/* 筛选器图标 */}
          <button
            onClick={() => {
              setShowMapFilter(!showMapFilter);
              setShowMapSearch(false);
            }}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-all ${
              showMapFilter || selectedYear
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="时间筛选"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        {/* 搜索面板 - 点击搜索图标显示 */}
        {showMapSearch && (
          <div className="absolute top-16 right-4 z-[1000] w-72">
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索城市、地点..."
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 筛选面板 - 点击筛选图标显示 */}
        {showMapFilter && (
          <div className="absolute top-16 right-4 z-[1000] w-72">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">时间筛选</span>
                <button
                  onClick={() => setShowMapFilter(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* 年份选择 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">年份</label>
                  <select
                    value={selectedYear ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleYearChange(value ? parseInt(value) : null);
                    }}
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
                  >
                    <option value="">全部年份</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 月份选择 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">月份</label>
                  <select
                    value={selectedMonth ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedMonth(value ? parseInt(value) : null);
                    }}
                    disabled={!selectedYear}
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">全部月份</option>
                    {selectedYear && [1,2,3,4,5,6,7,8,9,10,11,12].map((month) => (
                      <option key={month} value={month}>
                        {month}月
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 清除筛选 */}
                {(selectedYear || selectedMonth) && (
                  <button
                    onClick={handleClearFilters}
                    className="w-full py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-50 rounded-2xl py-3">
        <span>共 {filteredFootprints.length} 个足迹点</span>
        {selectedYear && <span>•</span>}
        {selectedYear && (
          <span>
            {selectedYear}年{selectedMonth ? `${selectedMonth}月` : '全年'}
          </span>
        )}
        {searchQuery && (
          <>
            <span>•</span>
            <span>搜索: {searchQuery}</span>
          </>
        )}
      </div>
    </>
  );

  // 渲染时间线内容
  const renderTimelineContent = () => (
    <>
      {/* 搜索栏 */}
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* 时间筛选 */}
      <div className="mb-6">
        <TimeFilter
          years={availableYears}
          months={availableMonths}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* 清除筛选按钮 */}
      {(selectedYear || selectedMonth || searchQuery) && (
        <button
          onClick={handleClearFilters}
          className="w-full mb-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          清除所有筛选条件
        </button>
      )}

      {/* 时间线 */}
      <Timeline
        footprints={filteredFootprints}
        onItemClick={handleListItemClick}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部标题栏 - Instagram风格简洁设计 */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Footprints className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-black tracking-tight">地图足迹</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrivacyPanel(!showPrivacyPanel)}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                showPrivacyPanel || Object.values(privacySettings).some(v => v)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title="隐私设置"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区 - 大留白Instagram风格 */}
      <main className="max-w-4xl mx-auto px-5 py-6 pb-24">
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'timeline' && renderTimelineContent()}
        {activeTab === 'stats' && <Stats footprints={filteredFootprints} />}
        
        {/* "我的"页面内容：显示Profile或子功能 */}
        {activeTab === 'profile' && !activeSubFeature && (
          <Profile 
            footprints={filteredFootprints} 
            onNavigate={(feature) => {
              setActiveSubFeature(feature);
              if (feature === 'publisher') setShowPublisher(true);
            }}
            onCloseSubFeature={() => setActiveSubFeature(null)}
            activeSubFeature={activeSubFeature}
          />
        )}
        
        {/* 搜索功能 */}
        {activeTab === 'profile' && activeSubFeature === 'search' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveSubFeature(null)} className="text-gray-500">
                ← 返回
              </button>
              <h2 className="text-xl font-bold">搜索</h2>
            </div>
            <div className="mb-6">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
                placeholder="搜索城市、地点或标签..."
              />
            </div>
            {searchQuery ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">找到 {filteredFootprints.length} 个结果</p>
                <FootprintList 
                  footprints={filteredFootprints} 
                  onItemClick={handleListItemClick}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>输入关键词搜索足迹</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 底部Tab导航 - Instagram风格简洁设计 (可滚动) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around items-center h-14 overflow-x-auto px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-xl mx-0.5 px-1 ${
                    isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''} ${
                    isActive ? 'text-black' : 'text-gray-400'
                  }`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-black' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 足迹详情弹窗 */}
      {selectedFootprint && (
        <FootprintDetail
          footprint={selectedFootprint}
          onClose={handleCloseDetail}
          privacySettings={privacySettings}
        />
      )}

      {/* 发布器弹窗 */}
      {showPublisher && (
        <FootprintPublisher
          onPublish={handlePublish}
          onClose={() => setShowPublisher(false)}
        />
      )}

      {/* 悬浮发布按钮 */}
      <button
        onClick={() => setShowPublisher(true)}
        className="fixed right-6 bottom-20 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default App;
