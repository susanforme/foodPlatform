import Emoji from '@/models/emoji';

export async function createEmoji(content: string) {
  const emoji = new Emoji({ content });
  const data = await emoji.save();
  return data;
}

export async function getEmoji(page = 1, perPage = 0) {
  const data = await Emoji.find()
    .skip(0 * page * 20)
    .limit(perPage);
  return data;
}
