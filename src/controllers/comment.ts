import Comment from '@/models/comment';
import { getCommentTree } from '@/plugins';

/**
 * @description
 * 查询评论
 */
export async function getComment(articleId: string) {
  const comment = await Comment.find(
    { articleId },
    {
      createTime: 1,
      img: 1,
      lastEditTime: 1,
      comment: 1,
      publisher: 1,
      commentFatherId: 1,
    },
  ).populate('publisher', {
    headImg: 1,
    username: 1,
    id: 1,
  });
  return getCommentTree(comment);
}

/**
 * @description
 * 创建评论,同时需要article配合
 */
export async function createComment(data: CreateCommentData) {
  const comment = new Comment({
    ...data,
    createTime: new Date().valueOf(),
  });
  const product = await comment.save();
  return product;
}

/**
 * @description
 * 更新评论,同时需要鉴定是否本人发表
 */
export async function updateComment(commentId: string, comment: string) {
  const product = await Comment.findByIdAndUpdate(commentId, { comment });
  return product;
}

/**
 * @description
 * 删除评论,同时需要鉴定是否本人发表,也需要更新文章中的评论
 */
export async function deleteComment(id: string) {
  await Comment.findByIdAndDelete(id);
  return;
}

interface CreateCommentData {
  comment: string;
  articleId: string;
  commentFatherId?: string;
  img?: string;
  publisher: string;
}
