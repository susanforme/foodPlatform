import Record from '@/models/record';

export async function getDiscussByUserId(userId: string) {
  const data = await Promise.all([Record.find({ receive: userId }), Record.find({ send: userId })]);
  return {
    attention: data[1].length,
    fan: data[0].length,
  };
}
