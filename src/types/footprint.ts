// 足迹数据类型定义 - 整合版
export interface Footprint {
  id: string;
  locationName: string;
  city: string;
  latitude: number;
  longitude: number;
  photos: Photo[];
  createdAt: string;
  note?: string;
  // 新增字段
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  isBookmarked: boolean;
  category: FootprintCategory;
}

export interface Photo {
  id: string;
  url: string;
  takenAt: string;
  footprintId: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface FilterOptions {
  year: number | null;
  month: number | null;
  searchQuery: string;
  tags: string[];
  category: FootprintCategory | null;
}

export type FootprintCategory = 
  | 'nature'      // 自然风光
  | 'city'        // 城市探索
  | 'food'        // 美食之旅
  | 'culture'     // 文化历史
  | 'entertainment' // 娱乐休闲
  | 'sports'      // 运动户外
  | 'other';      // 其他

// 标签定义
export const TAG_OPTIONS = [
  '浪漫', '美食', '夜景', '历史', '自然', '文艺',
  '探险', '休闲', '亲子', '朋友', '情侣', '独自'
];

// 分类定义
export const CATEGORY_OPTIONS: { value: FootprintCategory; label: string; icon: string }[] = [
  { value: 'nature', label: '自然风光', icon: '🏔️' },
  { value: 'city', label: '城市探索', icon: '🏙️' },
  { value: 'food', label: '美食之旅', icon: '🍜' },
  { value: 'culture', label: '文化历史', icon: '🏛️' },
  { value: 'entertainment', label: '娱乐休闲', icon: '🎢' },
  { value: 'sports', label: '运动户外', icon: '🏃' },
  { value: 'other', label: '其他', icon: '📌' },
];

// 行程规划
export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  footprints: Footprint[];
  coverImage?: string;
  isPublic: boolean;
  createdAt: string;
}
