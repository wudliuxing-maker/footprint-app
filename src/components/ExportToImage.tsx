import React, { useState, useRef } from 'react';
import { Download, Image, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Footprint } from '../types/footprint';

interface ExportToImageProps {
  footprints: Footprint[];
  children: React.ReactNode;
}

export const ExportToImage: React.FC<ExportToImageProps> = ({ footprints, children }) => {
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `footprint-map-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3 mb-5">
      <button
        onClick={handleExport}
        disabled={isExporting || footprints.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            导出中...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            导出为图片 ({footprints.length}个足迹)
          </>
        )}
      </button>
      <div ref={contentRef} className="hidden">
        {/* 导出内容模板 - Instagram风格 */}
        <div style={{ 
          width: '800px', 
          padding: '40px', 
          background: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ 
            background: '#262626', 
            padding: '30px', 
            borderRadius: '20px',
            color: 'white',
            marginBottom: '30px'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              🗺️ 我的旅行足迹
            </h1>
            <p style={{ opacity: 0.9, fontSize: '16px' }}>
              共 {footprints.length} 个足迹点 · {new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {footprints.slice(0, 10).map((fp) => (
              <div key={fp.id} style={{
                background: '#fafafa',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid #dbdbdb'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#262626', marginBottom: '8px' }}>
                  {fp.locationName}
                </h3>
                <p style={{ color: '#8e8e8e', fontSize: '14px', marginBottom: '8px' }}>
                  📍 {fp.city}
                </p>
                <p style={{ color: '#a8a8a8', fontSize: '12px' }}>
                  📅 {new Date(fp.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
          
          {footprints.length > 10 && (
            <div style={{ 
              marginTop: '20px', 
              textAlign: 'center', 
              color: '#8e8e8e',
              fontSize: '14px' 
            }}>
              ... 还有 {footprints.length - 10} 个足迹点
            </div>
          )}
          
          <div style={{ 
            marginTop: '30px', 
            textAlign: 'center', 
            color: '#a8a8a8', 
            fontSize: '12px' 
          }}>
            由地图足迹App生成
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
