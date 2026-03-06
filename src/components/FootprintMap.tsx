import React, { useEffect, useRef, useMemo, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Footprint } from '../types/footprint';

// 修复leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 自定义绿色标记图标 - 使用 useMemo 缓存
const createGreenIcon = () => new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface FootprintMapProps {
  footprints: Footprint[];
  onMarkerClick: (footprint: Footprint) => void;
  selectedFootprint: Footprint | null;
  mode: 'markers' | 'heatmap';
}

// 地图中心点控制器
const MapController: React.FC<{ center: [number, number] }> = memo(({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
});

MapController.displayName = 'MapController';

// 热力图图层组件
const HeatmapLayer: React.FC<{ footprints: Footprint[] }> = memo(({ footprints }) => {
  const map = useMap();
  const heatmapRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!map) return;

    // 移除旧的热力图图层
    if (heatmapRef.current) {
      map.removeLayer(heatmapRef.current);
    }

    // 创建热力图图层
    const heatmapLayer = L.layerGroup();
    
    // 使用简单的方式创建热力图效果 - 通过多个圆形渐变叠加
    footprints.forEach(fp => {
      // 创建多层圆形来模拟热力图效果
      const colors = [
        { radius: 60, color: 'rgba(255,0,0,0.6)' },
        { radius: 40, color: 'rgba(255,127,0,0.7)' },
        { radius: 25, color: 'rgba(255,255,0,0.8)' },
      ];
      
      colors.forEach(({ radius, color }) => {
        const circle = L.circle([fp.latitude, fp.longitude], {
          radius,
          fillColor: color,
          fillOpacity: 0.5,
          color: 'transparent',
          weight: 0
        });
        heatmapLayer.addLayer(circle);
      });
    });

    heatmapLayer.addTo(map);
    heatmapRef.current = heatmapLayer;

    return () => {
      if (heatmapRef.current) {
        map.removeLayer(heatmapRef.current);
      }
    };
  }, [map, footprints]);

  return null;
});

HeatmapLayer.displayName = 'HeatmapLayer';

// 标记点组件 - 独立出来便于优化
interface MarkerItemProps {
  footprint: Footprint;
  onClick: (footprint: Footprint) => void;
  icon: L.Icon;
}

const MarkerItem: React.FC<MarkerItemProps> = memo(({ footprint, onClick, icon }) => (
  <Marker
    position={[footprint.latitude, footprint.longitude]}
    icon={icon}
    eventHandlers={{
      click: () => onClick(footprint),
    }}
  >
    <Popup>
      <div className="text-center p-1">
        <h3 className="font-semibold text-gray-800">{footprint.locationName}</h3>
        <p className="text-sm text-gray-500">{footprint.city}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(footprint.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </p>
        <p className="text-xs text-green-600 mt-1">{footprint.photos.length}张照片</p>
      </div>
    </Popup>
  </Marker>
));

MarkerItem.displayName = 'MarkerItem';

export const FootprintMap: React.FC<FootprintMapProps> = memo(({
  footprints,
  onMarkerClick,
  selectedFootprint,
  mode = 'markers'
}) => {
  // 使用 useMemo 缓存图标实例
  const greenIcon = useMemo(() => createGreenIcon(), []);

  // 使用 useMemo 缓存地图中心点计算
  const center = useMemo((): [number, number] => {
    if (selectedFootprint) {
      return [selectedFootprint.latitude, selectedFootprint.longitude];
    }
    if (footprints.length > 0) {
      const avgLat = footprints.reduce((sum, fp) => sum + fp.latitude, 0) / footprints.length;
      const avgLng = footprints.reduce((sum, fp) => sum + fp.longitude, 0) / footprints.length;
      return [avgLat, avgLng];
    }
    // 默认中心点（中国）
    return [35.8617, 104.1954];
  }, [footprints, selectedFootprint]);

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="h-full w-full rounded-xl overflow-hidden"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {selectedFootprint && <MapController center={[selectedFootprint.latitude, selectedFootprint.longitude]} />}

      {/* 热力图模式 */}
      {mode === 'heatmap' && <HeatmapLayer footprints={footprints} />}

      {/* 标记模式 - 使用 Fragment 避免不必要的 DOM 包装 */}
      {mode === 'markers' && footprints.map((footprint) => (
        <MarkerItem
          key={footprint.id}
          footprint={footprint}
          onClick={onMarkerClick}
          icon={greenIcon}
        />
      ))}
    </MapContainer>
  );
});

FootprintMap.displayName = 'FootprintMap';
