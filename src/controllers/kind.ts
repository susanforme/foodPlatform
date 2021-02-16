import Kind from '@/models/kind';

export async function createKind(kindName: string) {
  const kind = new Kind({
    kindName,
  });
  const data = await kind.save();
  return data;
}

export async function getkind() {
  const data = await Kind.find();
  return data;
}
