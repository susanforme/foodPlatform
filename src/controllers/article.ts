import Article from '@/models/article';
import { IComment } from '@/models/comment';
import { IUser } from '@/models/user';
import { getCommentTree } from '@/plugins';
import { errMap, ServerError } from '@/plugins/errors';

/**
 * @description
 * 创建文章
 */
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

/**
 * @description
 * 查询文章
 */
export async function getArticle(id: string) {
  const product = await Article.findById(id, { give: 0 })
    .populate('author', {
      headImg: 1,
      username: 1,
      id: 1,
    })
    .populate({
      path: 'comment',
      select: ['createTime', 'img', 'lastEditTime', 'comment', 'publisher', 'commentFatherId'],
      model: 'Comment',
      populate: {
        path: 'publisher',
        model: 'User',
        select: ['headImg', 'username', '_id'],
      },
    });

  if (!product) {
    throw new ServerError(errMap.article.A0001);
  }
  const data = Object.assign(product, {
    comment: getCommentTree(product?.comment as IComment[]),
  });
  return data;
}

/**
 * @description
 * 根据点赞数量来排行,并且返回大概的信息,同时需要分类限制,如果没有分类则不限制,也可以直接返回随机数据
 */
export async function getCountArticle(data: GiveFiveCountArticleData) {
  const { page = 1, kind, perPage = 20, isGive = true } = data;
  const search = kind
    ? {
        kind,
      }
    : {};
  const total = await Article.find(search).countDocuments();
  let response;
  if (!isGive) {
    response = await Article.aggregate([
      {
        $sample: {
          size: perPage,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
    ]);
  } else {
    response = await Article.find(search)
      .skip((page - 1) * 20)
      .sort({
        give: 1,
      })
      .limit(perPage)
      .populate('author', {
        headImg: 1,
        username: 1,
        id: 1,
      });
  }
  const sRes = response.map((v) => {
    const { imgPath, score, author, give, title, content, label, _id: id } = v;
    const { headImg, username, _id: userId } = author as IUser;
    return {
      img: imgPath[0],
      score,
      author: {
        headImg,
        username,
        userId,
      },
      give: give.length,
      title,
      content,
      label,
      id,
    };
  });
  return {
    items: sRes,
    total,
  };
}

interface GiveFiveCountArticleData {
  page?: number;
  kind?: string;
  // 每页的个数
  perPage?: number;
  // 是否是按照点赞排
  isGive?: boolean;
}

/**
 * @description
 * 删除文章,注意鉴权
 */
export async function deleteArticle(id: string) {
  await Article.findByIdAndDelete(id);
  return {
    code: '00000',
    msg: '删除成功',
  };
}

/**
 * @description
 * 更新文章
 */
export async function updateArticle(data: UpdateArticleData) {
  const product = await Article.findByIdAndUpdate(data.id, {
    ...data,
    lastEditTime: new Date().valueOf(),
  });
  if (!product) {
    throw new ServerError(errMap.article.A0001);
  }
  return product;
}

/**
 * @description
 * 发表文章下的评论,这里只做文章数据集合的更新,还需要同时修改comment集合
 */
export async function createArticleComment(commentData: CommentData) {
  await Article.findByIdAndUpdate(commentData.articleId, {
    $push: {
      comment: commentData.commentId,
    },
  });
  return;
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
  return traffic + 1;
}

/**
 * 点赞文章,并返回点赞数量
 * @param articleId 文章id
 * @param userId 用户id
 */
export async function updateArticleGive(articleId: string, userId: string) {
  const giveData = await getArticleUserGive(articleId, userId);
  if (giveData.isGive) {
    return giveData.giveCount;
  }
  await Article.findByIdAndUpdate(articleId, {
    $push: {
      give: userId,
    },
  });
  return giveData.giveCount + 1;
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
  kind: string;
  label: string[];
  location: string;
  score: number;
  cityCode: string;
}

interface CommentData {
  articleId: string;
  commentId: string;
}

interface UpdateArticleData {
  title: string;
  content: string;
  imgPath: string[];
  id: string;
}
