/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 15:57:32
 * @FilePath: \foodPlatform\src\config\resolvers.ts
 * @LastEditTime: 2021-01-18 16:29:05
 */
import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { getIsDev } from '@/plugins';

export const resolvers = mergeResolvers(
  loadFilesSync(join(__dirname, `../graphql/resolvers/*.${getIsDev() ? 'ts' : 'js'}`)),
);
