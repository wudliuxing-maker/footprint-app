// 社交相关类型定义
export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  footprintsCount: number;
  isFollowing?: boolean;
}

export interface Like {
  id: string;
  userId: string;
  footprintId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  footprintId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

// 行程相关类型定义
export interface Trip {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  destinations: TripDestination[];
  createdAt: string;
  isPublic: boolean;
  likes: number;
  views: number;
}

export interface TripDestination {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  order: number;
}

// 离线地图相关类型
export interface OfflineMap {
  id: string;
  name: string;
  region: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  size: number;
  downloadedAt?: string;
  status: 'available' | 'downloading' | 'downloaded' | 'error';
}
