import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { getIsDev } from '@/plugins';
import scalar from './scalar';

const someResolvers = mergeResolvers(
  loadFilesSync(join(__dirname, `../graphql/resolvers/**/*.${getIsDev() ? 'ts' : 'js'}`)),
);

export const resolvers = Object.assign(someResolvers, scalar);
