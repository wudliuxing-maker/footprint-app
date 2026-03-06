import { useState } from 'react';
import { Download, Trash2, Map, CheckCircle, AlertCircle, WifiOff, Server } from 'lucide-react';

interface OfflineMap {
  id: string;
  name: string;
  region: string;
  size: string;
  status: 'available' | 'downloading' | 'downloaded' | 'error';
  downloadedAt?: string;
}

const presetRegions = [
  { id: 'shanghai', name: '上海', region: '华东', size: '45MB', center: [31.2304, 121.4737], zoom: 11 },
  { id: 'beijing', name: '北京', region: '华北', size: '52MB', center: [39.9042, 116.4074], zoom: 10 },
  { id: 'hangzhou', name: '杭州', region: '华东', size: '38MB', center: [30.2741, 120.1551], zoom: 11 },
  { id: 'chengdu', name: '成都', region: '西南', size: '48MB', center: [30.5728, 104.0668], zoom: 10 },
  { id: 'xian', name: '西安', region: '西北', size: '42MB', center: [34.3416, 108.9398], zoom: 11 },
  { id: 'sanya', name: '三亚', region: '华南', size: '28MB', center: [18.2528, 109.5119], zoom: 12 },
];

export function OfflineMaps() {
  const [downloadedMaps, setDownloadedMaps] = useState<OfflineMap[]>([
    {
      id: 'down1',
      name: '上海',
      region: '华东',
      size: '45MB',
      status: 'downloaded',
      downloadedAt: '2025-02-15',
    },
  ]);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);

  // 下载地图
  const downloadMap = (region: typeof presetRegions[0]) => {
    if (downloadedMaps.find(m => m.id === region.id)) return;
    
    setDownloadProgress(region.id);
    
    // 模拟下载过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadProgress(null);
        setDownloadedMaps([
          ...downloadedMaps,
          {
            id: region.id,
            name: region.name,
            region: region.region,
            size: region.size,
            status: 'downloaded',
            downloadedAt: new Date().toISOString().split('T')[0],
          },
        ]);
      }
    }, 200);
  };

  // 删除离线地图
  const deleteMap = (mapId: string) => {
    setDownloadedMaps(downloadedMaps.filter(m => m.id !== mapId));
  };

  return (
    <div className="space-y-6">
      {/* 状态提示 */}
      <div className="bg-gray-50 rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">离线地图</h3>
            <p className="text-sm text-gray-500">
              已下载 {downloadedMaps.length} 个地区，节省流量随时查看
            </p>
          </div>
        </div>
      </div>

      {/* 已下载地图 */}
      {downloadedMaps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">已下载</h3>
          <div className="space-y-3">
            {downloadedMaps.map(map => (
              <div
                key={map.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{map.name}</h4>
                    <p className="text-sm text-gray-500">
                      {map.region} · {map.size} · {map.downloadedAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMap(map.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 可下载地区 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">下载更多地区</h3>
        <div className="grid grid-cols-2 gap-3">
          {presetRegions.map(region => {
            const isDownloaded = !!downloadedMaps.find(m => m.id === region.id);
            const isDownloading = downloadProgress === region.id;
            
            return (
              <button
                key={region.id}
                onClick={() => !isDownloaded && !isDownloading && downloadMap(region)}
                disabled={isDownloaded || isDownloading}
                className={`p-4 rounded-2xl text-left transition-all ${
                  isDownloaded
                    ? 'bg-gray-50 border border-gray-100'
                    : isDownloading
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{region.name}</span>
                  {isDownloaded && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {isDownloading && (
                    <span className="text-xs text-blue-600 font-medium">下载中</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{region.region}</span>
                  <span>{region.size}</span>
                </div>
                {isDownloading && (
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 离线功能说明 */}
      <div className="bg-blue-50 rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">离线地图使用说明</h4>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• 下载后可在无网络环境下查看地图</li>
              <li>• 离线地图会占用设备存储空间</li>
              <li>• 建议在WiFi环境下下载地图数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
