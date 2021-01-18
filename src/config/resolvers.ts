import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { getIsDev } from '@/plugins';

export const resolvers = mergeResolvers(
  loadFilesSync(join(__dirname, `../graphql/resolvers/*.${getIsDev() ? 'ts' : 'js'}`)),
);
