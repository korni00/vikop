import {
  Like,
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";

export interface LikeWithUser extends Like {
  createdBy: UserType;
}

export interface CommentWithUsers extends CommentType {
  createdBy: UserType;
  commentLikes: LikeWithUser[];
}

export interface PostProps extends PostType {
  createdBy: UserType;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

export interface LikeWithComments extends Like {
  comment: CommentWithUsers | null;
}

export interface LikeWithPosts extends Like {
  post: PostProps | null;
}

export interface UserWithFollow {
  follower: UserType;
  following: UserType;
}

export interface CompleteUser extends UserType {
  posts: PostProps[];
  comments: CommentWithUsers[];
  likedPosts: LikeWithPosts[];
  likedComments: LikeWithComments[];
  followers: UserWithFollow[];
  followersCount?: number;
  followingCount?: number;
}
