import { User, Comment, Like, Trip } from '../types/social';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: '旅行达人小王',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    bio: '热爱旅行，脚步不停',
    followersCount: 1234,
    followingCount: 567,
    footprintsCount: 89,
    isFollowing: false,
  },
  {
    id: 'u2',
    name: '摄影师小李',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    bio: '用镜头记录美好瞬间',
    followersCount: 5678,
    followingCount: 234,
    footprintsCount: 156,
    isFollowing: true,
  },
  {
    id: 'u3',
    name: '美食探索者',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    bio: '唯有美食与旅行不可辜负',
    followersCount: 3456,
    followingCount: 456,
    footprintsCount: 234,
    isFollowing: false,
  },
];

// 当前用户
export const currentUser: User = {
  id: 'current',
  name: '我的足迹',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
  bio: '记录每一次旅行',
  followersCount: 89,
  followingCount: 45,
  footprintsCount: 13,
  isFollowing: false,
};

// 模拟评论数据
export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: '旅行达人小王',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    footprintId: '1',
    content: '外滩夜景真的超级美！',
    createdAt: '2024-03-16T10:00:00',
    likes: 12,
    isLiked: false,
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: '摄影师小李',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    footprintId: '1',
    content: '这个机位拍摄效果太棒了',
    createdAt: '2024-03-16T14:30:00',
    likes: 8,
    isLiked: true,
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: '美食探索者',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    footprintId: '3',
    content: '故宫真的很震撼！',
    createdAt: '2024-07-11T09:00:00',
    likes: 25,
    isLiked: false,
  },
];

// 模拟点赞数据
export const mockLikes: Like[] = [
  { id: 'l1', userId: 'u1', footprintId: '1', createdAt: '2024-03-16T09:00:00' },
  { id: 'l2', userId: 'u2', footprintId: '1', createdAt: '2024-03-16T12:00:00' },
  { id: 'l3', userId: 'u3', footprintId: '2', createdAt: '2024-05-21T10:00:00' },
];

// 模拟行程数据
export const mockTrips: Trip[] = [
  {
    id: 't1',
    name: '华东五市游',
    description: '上海、杭州、苏州、南京、无锡',
    coverImage: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800',
    startDate: '2024-03-10',
    endDate: '2024-03-20',
    destinations: [
      { id: 'd1', name: '外滩', city: '上海', latitude: 31.2405, longitude: 121.4901, arrivalDate: '2024-03-10', departureDate: '2024-03-12', order: 1 },
      { id: 'd2', name: '西湖', city: '杭州', latitude: 30.2468, longitude: 120.1377, arrivalDate: '2024-03-13', departureDate: '2024-03-15', order: 2 },
      { id: 'd3', name: '拙政园', city: '苏州', latitude: 31.3236, longitude: 120.6234, arrivalDate: '2024-03-16', departureDate: '2024-03-17', order: 3 },
    ],
    createdAt: '2024-03-01',
    isPublic: true,
    likes: 156,
    views: 2345,
  },
  {
    id: 't2',
    name: '川西之旅',
    description: '成都、九寨沟、黄龙',
    coverImage: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800',
    startDate: '2024-09-01',
    endDate: '2024-09-07',
    destinations: [
      { id: 'd4', name: '宽窄巷子', city: '成都', latitude: 30.6738, longitude: 104.0668, arrivalDate: '2024-09-01', departureDate: '2024-09-02', order: 1 },
      { id: 'd5', name: '九寨沟', city: '阿坝', latitude: 32.9048, longitude: 103.8965, arrivalDate: '2024-09-03', departureDate: '2024-09-05', order: 2 },
    ],
    createdAt: '2024-08-15',
    isPublic: true,
    likes: 89,
    views: 1234,
  },
  {
    id: 't3',
    name: '春节海南行',
    description: '三亚、海口',
    coverImage: 'https://images.unsplash.com/photo-1548266652-99cf277df528?w=800',
    startDate: '2025-01-20',
    endDate: '2025-01-28',
    destinations: [
      { id: 'd6', name: '天涯海角', city: '三亚', latitude: 18.2823, longitude: 109.5025, arrivalDate: '2025-01-22', departureDate: '2025-01-25', order: 1 },
    ],
    createdAt: '2025-01-10',
    isPublic: false,
    likes: 45,
    views: 567,
  },
];
