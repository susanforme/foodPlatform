import { GraphQLScalarType, Kind } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

const bigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  description: '一个大整数,为了解决Int位数不够',
  serialize(value) {
    return parseInt(value);
  },
  parseValue(value: number) {
    return value;
  },
  // 当传入的查询字符串包含标量的硬编码值时，该值是查询文档的抽象语法树属性(AST)的一部分
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // 将编码的ast字符串转换为parseValue所期望的类型
      return parseInt(ast.value, 10);
    }
    return null;
  },
});

export default {
  BigInt: bigIntScalar,
  Upload: GraphQLUpload,
};
