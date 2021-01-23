import Comment from '@/models/comment';

/**
 * @description
 * 创建评论,同时需要article配合
 */
export async function createComment(data: CreateCommentData) {
  const comment = new Comment({
    ...data,
    createTime: new Date().valueOf(),
  });
  const cData = await comment.save();
  return {
    code: '0000',
    msg: '成功发表评论',
    data: cData,
  };
}

/**
 * @description
 * 更新评论,同时需要鉴定是否本人发表
 */
export async function updateComment(commentId: string, comment: string) {
  await Comment.findByIdAndUpdate(commentId, { comment });
  return {
    code: '0000',
    msg: '成功更新评论',
  };
}

/**
 * @description
 * 删除评论,同时需要鉴定是否本人发表,也需要更新文章中的评论
 */
export async function deleteComment(id: string) {
  await Comment.findByIdAndDelete(id);
  return {
    code: '0000',
    msg: '成功删除评论',
  };
}

interface CreateCommentData {
  comment: string;
  articleId: string;
  commentFatherId?: string;
  img?: string;
  publisher: string;
}
