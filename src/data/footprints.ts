import { Footprint, FootprintCategory } from '../types/footprint';

// 模拟足迹数据
// 添加新的模拟照片数据（使用本地图片）
const newPhotoFootprints: Footprint[] = [
  {
    id: '11',
    locationName: '鼓浪屿',
    city: '厦门',
    latitude: 24.4398,
    longitude: 118.0635,
    photos: [
      { id: 'p16', url: '/62a158e4-6a76-4594-961d-85fc519238ee.jpg', takenAt: '2025-02-10T09:30:00', footprintId: '11' },
    ],
    createdAt: '2025-02-10',
    note: '厦门鼓浪屿日光岩',
    tags: ['浪漫', '文艺', '朋友'],
    likes: 128,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    category: 'nature' as FootprintCategory,
  },
  {
    id: '12',
    locationName: '天涯海角',
    city: '三亚',
    latitude: 18.2823,
    longitude: 109.5025,
    photos: [
      { id: 'p17', url: '/94e30613-a10b-42aa-8b39-561ce46da234.jpg', takenAt: '2025-01-25T16:45:00', footprintId: '12' },
    ],
    createdAt: '2025-01-25',
    note: '三亚天涯海角',
    tags: ['浪漫', '休闲', '情侣'],
    likes: 256,
    isLiked: true,
    comments: [],
    isBookmarked: false,
    category: 'nature' as FootprintCategory,
  },
  {
    id: '13',
    locationName: '布达拉宫',
    city: '拉萨',
    latitude: 29.6578,
    longitude: 91.1172,
    photos: [
      { id: 'p18', url: '/9abe2f03-2fc9-4fbb-9dba-313b0645744b.jpg', takenAt: '2024-12-20T11:20:00', footprintId: '13' },
    ],
    createdAt: '2024-12-20',
    note: '拉萨布达拉宫',
    tags: ['历史', '文化', '探险'],
    likes: 512,
    isLiked: false,
    comments: [],
    isBookmarked: true,
    category: 'culture' as FootprintCategory,
  },
];

export const mockFootprints: Footprint[] = [
  {
    id: '1',
    locationName: '外滩',
    city: '上海',
    latitude: 31.2405,
    longitude: 121.4901,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1548266652-99cf277df528?w=800', takenAt: '2024-03-15T18:30:00', footprintId: '1' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800', takenAt: '2024-03-15T18:45:00', footprintId: '1' },
    ],
    createdAt: '2024-03-15',
    note: '傍晚的外滩真美',
    tags: ['浪漫', '夜景', '朋友'],
    likes: 326,
    isLiked: true,
    comments: [],
    isBookmarked: false,
    category: 'city' as FootprintCategory,
  },
  {
    id: '2',
    locationName: '西湖',
    city: '杭州',
    latitude: 30.2468,
    longitude: 120.1377,
    photos: [
      { id: 'p3', url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800', takenAt: '2024-05-20T10:00:00', footprintId: '2' },
    ],
    createdAt: '2024-05-20',
    note: '春天的西湖风景如画',
    tags: ['自然', '浪漫', '休闲'],
    likes: 458,
    isLiked: false,
    comments: [],
    isBookmarked: true,
    category: 'nature' as FootprintCategory,
  },
  {
    id: '3',
    locationName: '故宫',
    city: '北京',
    latitude: 39.9163,
    longitude: 116.3972,
    photos: [
      { id: 'p4', url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', takenAt: '2024-07-10T14:20:00', footprintId: '3' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', takenAt: '2024-07-10T15:00:00', footprintId: '3' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', takenAt: '2024-07-10T15:30:00', footprintId: '3' },
    ],
    createdAt: '2024-07-10',
    note: '暑期旅游旺季',
    tags: ['历史', '文化', '亲子'],
    likes: 892,
    isLiked: true,
    comments: [],
    isBookmarked: false,
    category: 'culture' as FootprintCategory,
  },
  {
    id: '4',
    locationName: '宽窄巷子',
    city: '成都',
    latitude: 30.6738,
    longitude: 104.0668,
    photos: [
      { id: 'p7', url: 'https://images.unsplash.com/photo-1598001725607-048c360661f5?w=800', takenAt: '2024-09-05T11:00:00', footprintId: '4' },
    ],
    createdAt: '2024-09-05',
    note: '成都美食之旅',
    tags: ['美食', '朋友', '文艺'],
    likes: 234,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    category: 'food' as FootprintCategory,
  },
  {
    id: '5',
    locationName: '张家界国家森林公园',
    city: '张家界',
    latitude: 29.1173,
    longitude: 110.4792,
    photos: [
      { id: 'p8', url: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800', takenAt: '2024-10-02T09:00:00', footprintId: '5' },
      { id: 'p9', url: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800', takenAt: '2024-10-02T10:30:00', footprintId: '5' },
    ],
    createdAt: '2024-10-02',
    note: '秋天的张家界美不胜收',
    tags: ['自然', '探险', '朋友'],
    likes: 567,
    isLiked: true,
    comments: [],
    isBookmarked: true,
    category: 'nature' as FootprintCategory,
  },
  {
    id: '6',
    locationName: '陆家嘴',
    city: '上海',
    latitude: 31.2397,
    longitude: 121.4994,
    photos: [
      { id: 'p10', url: 'https://images.unsplash.com/photo-1558435186-d31d14352b89?w=800', takenAt: '2025-01-20T19:00:00', footprintId: '6' },
    ],
    createdAt: '2025-01-20',
    note: '夜景璀璨',
    tags: ['夜景', '浪漫', '情侣'],
    likes: 445,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    category: 'city' as FootprintCategory,
  },
  {
    id: '7',
    locationName: '迪士尼乐园',
    city: '上海',
    latitude: 31.1443,
    longitude: 121.6571,
    photos: [
      { id: 'p11', url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800', takenAt: '2025-02-14T12:00:00', footprintId: '7' },
      { id: 'p12', url: 'https://images.unsplash.com/photo-1514231038622-9d9e14ae0480?w=800', takenAt: '2025-02-14T14:00:00', footprintId: '7' },
    ],
    createdAt: '2025-02-14',
    note: '情人节快乐',
    tags: ['浪漫', '亲子', '朋友'],
    likes: 1024,
    isLiked: true,
    comments: [],
    isBookmarked: true,
    category: 'entertainment' as FootprintCategory,
  },
  {
    id: '8',
    locationName: '九寨沟',
    city: '阿坝',
    latitude: 32.9048,
    longitude: 103.8965,
    photos: [
      { id: 'p13', url: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800', takenAt: '2025-02-28T08:00:00', footprintId: '8' },
    ],
    createdAt: '2025-02-28',
    note: '冬日九寨沟别有韵味',
    tags: ['自然', '探险', '休闲'],
    likes: 678,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    category: 'nature' as FootprintCategory,
  },
  {
    id: '9',
    locationName: '拙政园',
    city: '苏州',
    latitude: 31.3236,
    longitude: 120.6234,
    photos: [
      { id: 'p14', url: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800', takenAt: '2025-03-01T10:00:00', footprintId: '9' },
    ],
    createdAt: '2025-03-01',
    note: '苏州园林甲天下',
    tags: ['历史', '文艺', '朋友'],
    likes: 345,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    category: 'culture' as FootprintCategory,
  },
  {
    id: '10',
    locationName: '洪崖洞',
    city: '重庆',
    latitude: 29.5630,
    longitude: 106.5734,
    photos: [
      { id: 'p15', url: 'https://images.unsplash.com/photo-1565178979032-75c0a6e5d4a3?w=800', takenAt: '2025-03-02T20:00:00', footprintId: '10' },
    ],
    createdAt: '2025-03-02',
    note: '重庆夜景名不虚传',
    tags: ['夜景', '美食', '朋友'],
    likes: 567,
    isLiked: true,
    comments: [],
    isBookmarked: true,
    category: 'city' as FootprintCategory,
  },
  ...newPhotoFootprints,
];

// 获取所有可用年份
export const getAvailableYears = (footprints: Footprint[]): number[] => {
  const years = new Set<number>();
  footprints.forEach(fp => {
    years.add(new Date(fp.createdAt).getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
};

// 获取某年的可用月份
export const getAvailableMonths = (footprints: Footprint[], year: number): number[] => {
  const months = new Set<number>();
  footprints.forEach(fp => {
    const fpYear = new Date(fp.createdAt).getFullYear();
    if (fpYear === year) {
      months.add(new Date(fp.createdAt).getMonth() + 1);
    }
  });
  return Array.from(months).sort((a, b) => a - b);
};
