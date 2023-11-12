import { Timestamp } from 'firebase/firestore';

export interface CaUserId {
  userId?: string;
}

export interface CaUser extends CaUserId {
  userName: string;
  userNumber: number;
  photoUrl?: string;
  created?: Date;
  lastLogin?: Date;
  bio?: string;
  posts?: CaPost[];
}
export interface CaPost {
  userId: string;
  caption: string;
  mediaUrl: string;
  created: Timestamp;
  category: string;
  likes: number;
  commentsCount: number;
  comments: CaComment[];
}
export interface CaMeme {
  box_count: number;
  captions: string;
  height: number;
  id: string;
  upvotes: number;
  downvotes: number;
  name: string;
  url: string;
  width: number;
}
export interface CaComment {
  commentId: string;
  postId: string;
  userId: string;
  commentText: string;
  created: Date;
  like: CaLike[];
}
export interface CaLike {
  likeId: string;
  postId: string;
  userId: string;
  created: Date;
  followers: CaFollower[];
}
export interface CaFollower {
  followerId: string;
  followerUserId: string;
  followedUserId: string;
  tags: CaTag[];
}
export interface CaTag {
  tagId: string;
  tagName: string;
  postTags: CaPostTag[];
}
export interface CaPostTag {
  postTagId: string;
  postId: string;
  tagId: string;
  ReportedPosts: CaReportPost[];
}
export interface CaReportPost {
  reportId: string;
  postId: string;
  reportingUserID: string;
  reported: Date;
  reason: string;
  savedPosts: CaSavedPost[];
}

export interface CaSavedPost {
  saveId: string;
  postId: string;
  userId: string;
  savedAt: Date;
  notifications: CaNotification[];
}
export interface CaNotification {
  notificationId: string;
  userId: string;
  notificationText: string;
  created: Date;
  isRead: boolean;
}
