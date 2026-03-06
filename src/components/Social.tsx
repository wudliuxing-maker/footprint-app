import { useState } from 'react';
import { User, Comment } from '../types/social';
import { mockUsers, mockComments, currentUser } from '../data/social';
import { Heart, MessageCircle, Send, UserPlus, UserCheck, MapPin, Calendar } from 'lucide-react';

interface SocialProps {
  onFootprintClick?: (footprintId: string) => void;
}

export function Social({ onFootprintClick }: SocialProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [activeTab, setActiveTab] = useState<'discover' | 'feed'>('discover');
  const [newComment, setNewComment] = useState('');
  const [selectedFootprint, setSelectedFootprint] = useState<string | null>('1');

  // 关注/取消关注
  const toggleFollow = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isFollowing: !user.isFollowing,
          followersCount: user.isFollowing ? user.followersCount - 1 : user.followersCount + 1
        };
      }
      return user;
    }));
  };

  // 点赞/取消点赞
  const toggleLike = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  // 添加评论
  const addComment = () => {
    if (!newComment.trim() || !selectedFootprint) return;
    const comment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      footprintId: selectedFootprint,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  // 获取当前选中足迹的评论
  const currentComments = comments.filter(c => c.footprintId === selectedFootprint);

  return (
    <div className="space-y-6">
      {/* Tab切换 */}
      <div className="flex gap-3 bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'discover' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          发现用户
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'feed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          动态
        </button>
      </div>

      {activeTab === 'discover' ? (
        /* 发现用户 */
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">推荐关注</h3>
          {users.map(user => (
            <div key={user.id} className="bg-white border border-gray-100 rounded-3xl p-5">
              <div className="flex items-start gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{user.bio}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span><strong className="text-gray-800">{user.followersCount}</strong> 粉丝</span>
                    <span><strong className="text-gray-800">{user.footprintsCount}</strong> 足迹</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    user.isFollowing
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-black text-white'
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      已关注
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      关注
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 动态流 */
        <div className="space-y-6">
          {/* 足迹选择 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['1', '2', '3'].map(id => (
              <button
                key={id}
                onClick={() => setSelectedFootprint(id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFootprint === id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                足迹 #{id}
              </button>
            ))}
          </div>

          {/* 评论列表 */}
          <div className="space-y-4">
            {currentComments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无评论，快来抢沙发~</p>
              </div>
            ) : (
              currentComments.map(comment => (
                <div key={comment.id} className="bg-white border border-gray-100 rounded-3xl p-5">
                  <div className="flex gap-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{comment.userName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => toggleLike(comment.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            comment.isLiked ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                          {comment.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 添加评论 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="添加评论..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="p-2 bg-black rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
