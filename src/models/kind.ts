import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const KindSchema = new Schema({
  kindName: {
    type: String,
    required: true,
  },
});
const Kind = mongoose.model<IKind>('Kind', KindSchema);

export default Kind;

export interface IKind extends mongoose.Document {
  kindName: string;
}
