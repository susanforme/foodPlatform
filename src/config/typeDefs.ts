/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 15:57:14
 * @FilePath: \foodPlatform\src\config\typeDefs.ts
 * @LastEditTime: 2021-01-18 16:06:02
 */
import { join } from 'path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

export const typeDefs = mergeTypeDefs(
  loadFilesSync(join(__dirname, '../graphql/gql/**/*.graphql')),
);
