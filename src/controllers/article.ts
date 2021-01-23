import Article from '@/models/article';
import { IComment } from '@/models/comment';
import { getCommentTree } from '@/plugins';
import { errMap, ServerError } from '@/plugins/errors';

// 返回字段应该添加是否点赞,点赞数量
export async function createArticle(data: createArticleData) {
  const article = new Article({
    ...data,
    createTime: new Date().valueOf(),
    comment: [],
    give: [],
    lastEditTime: 0,
    traffic: 0,
  });
  const response = await article.save();
  return response;
}

export async function getArticle(id: string) {
  const product = await Article.findById(id)
    .populate('author', {
      headImg: 1,
      userName: 1,
      id: 1,
    })
    .populate('comment', {
      createTime: 1,
      img: 1,
      lastEditTime: 1,
      comment: 1,
      publisher: 1,
      commentFatherId: 1,
    })
    .populate('comment.publisher', {
      headImg: 1,
      userName: 1,
      id: 1,
    });
  const data = {
    ...product,
    comment: getCommentTree(product?.comment as IComment[]),
  };
  return data;
}

/**
 * @description
 * 这里只做文章数据集合的更新,还需要同时修改comment集合
 */
export async function updateArticleComment(
  articleId: string,
  userId: string,
  commentData: commentData,
) {
  const newComment = {
    ...commentData,
    publisher: userId,
    createTime: new Date().valueOf(),
    articleId,
  };
  await Article.findByIdAndUpdate(articleId, {
    $push: {
      comment: newComment,
    },
  });
  return {
    code: '00000',
    msg: '评论成功',
    data: newComment,
  };
}

/**
 * @description
 * 更新文章访问量
 * @param id 文章id
 */
export async function updateArticleTraffic(id: string) {
  const data = await Article.findById(id, 'traffic');
  if (!data) {
    throw new ServerError(errMap.article.A0001);
  }
  const traffic = data.traffic;
  await Article.findByIdAndUpdate(id, {
    traffic: traffic + 1,
  });
  return {
    code: '00000',
    msg: '更新文章访问量成功',
  };
}

/**
 * 点赞文章,并返回点赞数量
 * @param articleId 文章id
 * @param userId 用户id
 */
export async function updateArticleGive(articleId: string, userId: string) {
  const data = await Article.findByIdAndUpdate(articleId, {
    $push: {
      give: userId,
    },
  });
  if (!data) {
    throw new ServerError(errMap.article.A0001);
  }
  return data.give.length;
}

/**
 * 当前用户此文章是否点赞,点赞数量多少,未登录传空即可
 * @param articleId 文章id
 * @param userId 用户id
 */
export async function getArticleUserGive(articleId: string, userId: string) {
  const data = await Article.findById(articleId, 'give');
  if (!data) {
    throw new ServerError(errMap.article.A0001);
  }
  const give = data.give,
    isGive = (give as string[]).includes(userId),
    giveCount = give.length;
  return { isGive, giveCount };
}

interface createArticleData {
  author: string;
  title: string;
  content: string;
  imgPath: string[];
  kind: string[];
  label: string[];
}

interface commentData {
  comment: string;
  img?: string;
  commentFatherId?: string;
}
