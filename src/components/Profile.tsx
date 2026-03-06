import { Footprint } from '../types/footprint';
import { SubFeatureType } from '../App';
import { User, Settings, Shield, Download, Trash2, Heart, Share2, Info, Plus, Search, Calendar, Image, MapPin } from 'lucide-react';

interface ProfileProps {
  footprints: Footprint[];
  onNavigate: (feature: SubFeatureType) => void;
  onCloseSubFeature: () => void;
  activeSubFeature: SubFeatureType;
}

export function Profile({ footprints, onNavigate, onCloseSubFeature, activeSubFeature }: ProfileProps) {
  const totalFootprints = footprints.length;
  
  // 城市覆盖
  const cities = new Set(footprints.map(fp => fp.city)).size;
  
  // 首次记录
  const sortedByDate = [...footprints].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const firstDate = sortedByDate[0] ? new Date(sortedByDate[0].createdAt).toLocaleDateString('zh-CN') : '-';

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 - Instagram风格简洁设计 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">旅行者</h2>
            <p className="text-gray-400 text-sm mt-1">记录每一次脚步</p>
          </div>
        </div>
        
        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-black">{totalFootprints}</p>
            <p className="text-sm text-gray-500 mt-1">足迹</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-black">{cities}</p>
            <p className="text-sm text-gray-500 mt-1">城市</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-black">{firstDate}</p>
            <p className="text-sm text-gray-500 mt-1">首次记录</p>
          </div>
        </div>
      </div>

      {/* 常用功能入口 */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-black text-lg">常用功能</h3>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <button 
            onClick={() => onNavigate('publisher')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
          >
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-black">发布</span>
          </button>
          
          <button 
            onClick={() => onNavigate('search')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-medium text-black">搜索</span>
          </button>
          
          <button 
            onClick={() => onNavigate('trip')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-medium text-black">行程</span>
          </button>
          
          <button 
            onClick={() => onNavigate('poster')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Image className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-medium text-black">分享</span>
          </button>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-black text-lg">数据管理</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Download className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">导出数据</p>
              <p className="text-sm text-gray-400 mt-0.5">导出所有足迹为JSON</p>
            </div>
          </button>
          
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">清空数据</p>
              <p className="text-sm text-gray-400 mt-0.5">删除所有足迹记录</p>
            </div>
          </button>
        </div>
      </div>

      {/* 设置 */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-black text-lg">设置</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">隐私设置</p>
              <p className="text-sm text-gray-400 mt-0.5">管理位置信息显示</p>
            </div>
          </button>
          
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">应用设置</p>
              <p className="text-sm text-gray-400 mt-0.5">主题、语言等</p>
            </div>
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-black text-lg">关于</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">关于我们</p>
              <p className="text-sm text-gray-400 mt-0.5">发现更多功能</p>
            </div>
          </button>
          
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-black">分享应用</p>
              <p className="text-sm text-gray-400 mt-0.5">推荐给朋友</p>
            </div>
          </button>
        </div>
      </div>

      {/* 版本信息 */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Info className="w-4 h-4" />
          <span className="text-sm">地图足迹 V3.1</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">记录你的每一次旅行</p>
      </div>

      {/* 底部安全区域 */}
      <div className="h-24" />
    </div>
  );
}
