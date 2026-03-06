import { useState } from 'react';
import { X, Plus, Calendar, MapPin, Trash2, Share2, Lock, Globe, ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { Trip, Footprint, CATEGORY_OPTIONS } from '../types/footprint';

interface TripPlannerProps {
  footprints: Footprint[];
  onSave: (trip: Trip) => void;
  onClose: () => void;
  existingTrip?: Trip;
}

export function TripPlanner({ footprints, onSave, onClose, existingTrip }: TripPlannerProps) {
  const [step, setStep] = useState<'info' | 'select' | 'preview'>(existingTrip ? 'preview' : 'info');
  const [name, setName] = useState(existingTrip?.name || '');
  const [startDate, setStartDate] = useState(existingTrip?.startDate || '');
  const [endDate, setEndDate] = useState(existingTrip?.endDate || '');
  const [isPublic, setIsPublic] = useState(existingTrip?.isPublic || false);
  const [selectedFootprints, setSelectedFootprints] = useState<Footprint[]>(existingTrip?.footprints || []);

  const handleAddFootprint = (fp: Footprint) => {
    if (!selectedFootprints.find(f => f.id === fp.id)) {
      setSelectedFootprints([...selectedFootprints, fp]);
    }
  };

  const handleRemoveFootprint = (fpId: string) => {
    setSelectedFootprints(prev => prev.filter(f => f.id !== fpId));
  };

  const handleSave = () => {
    const trip: Trip = {
      id: existingTrip?.id || `trip_${Date.now()}`,
      name,
      startDate,
      endDate,
      footprints: selectedFootprints,
      coverImage: selectedFootprints[0]?.photos[0]?.url,
      isPublic,
      createdAt: existingTrip?.createdAt || new Date().toISOString(),
    };
    onSave(trip);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getCategoryIcon = (category: string) => 
    CATEGORY_OPTIONS.find(c => c.value === category)?.icon || '📌';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={() => {
            if (step === 'info') onClose();
            else if (step === 'select') setStep('info');
            else setStep('select');
          }} className="p-2 hover:bg-gray-100 rounded-full">
            {step === 'info' ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h2 className="text-lg font-semibold">
            {step === 'info' ? '创建行程' : step === 'select' ? '选择足迹' : '行程预览'}
          </h2>
          <button 
            onClick={step === 'info' ? () => setStep('select') : handleSave}
            disabled={step === 'info' && (!name || !startDate || !endDate)}
            className="text-black font-medium disabled:opacity-50"
          >
            {step === 'info' ? '下一步' : '完成'}
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          {step === 'info' && (
            <div className="p-5 space-y-5">
              {/* 行程名称 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">行程名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：五一成都之旅"
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* 日期范围 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">开始日期</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">结束日期</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              {/* 隐私设置 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">可见性</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl transition-all ${
                      !isPublic ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    私人
                  </button>
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl transition-all ${
                      isPublic ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                    公开
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'select' && (
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-4">选择要添加到行程的足迹</p>
              <div className="space-y-3">
                {footprints.map(fp => (
                  <button
                    key={fp.id}
                    onClick={() => handleAddFootprint(fp)}
                    disabled={!!selectedFootprints.find(f => f.id === fp.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                      selectedFootprints.find(f => f.id === fp.id)
                        ? 'bg-gray-100 opacity-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      {fp.photos[0] ? (
                        <img src={fp.photos[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(fp.category)}</span>
                        <h3 className="font-semibold truncate">{fp.locationName}</h3>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{fp.city} · {fp.createdAt}</p>
                    </div>
                    {selectedFootprints.find(f => f.id === fp.id) && (
                      <span className="text-green-500 text-sm font-medium">已添加</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="p-5">
              {/* 行程信息 */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-5">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(startDate)} - {formatDate(endDate)}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm">{selectedFootprints.length}个足迹</span>
                </div>
              </div>

              {/* 已选足迹列表 */}
              <div className="space-y-3">
                {selectedFootprints.map((fp, idx) => (
                  <div key={fp.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
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
                      <p className="text-sm text-gray-500">{fp.city}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFootprint(fp.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedFootprints.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>还没有添加足迹</p>
                  <button 
                    onClick={() => setStep('select')}
                    className="mt-3 text-black font-medium"
                  >
                    去添加
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {step === 'select' && (
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={() => setStep('preview')}
              disabled={selectedFootprints.length === 0}
              className="w-full py-4 bg-black text-white rounded-2xl font-medium disabled:opacity-50"
            >
              查看行程预览 ({selectedFootprints.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 行程列表组件
export function TripList({ trips, onTripClick }: { trips: Trip[], onTripClick: (trip: Trip) => void }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (trips.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>还没有行程规划</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <button
          key={trip.id}
          onClick={() => onTripClick(trip)}
          className="w-full flex gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-left transition-colors"
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            {trip.coverImage ? (
              <img src={trip.coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{trip.name}</h3>
            <p className="text-sm text-gray-500">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
            <p className="text-sm text-gray-400">{trip.footprints.length}个足迹</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
