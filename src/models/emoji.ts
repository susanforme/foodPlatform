import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const EmojiSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});
const Emoji = mongoose.model<IEmoji>('Emoji', EmojiSchema);

export default Emoji;

export interface IEmoji extends mongoose.Document {
  content: String;
}
