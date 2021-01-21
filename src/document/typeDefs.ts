import { join } from 'path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

export const typeDefs = mergeTypeDefs(
  loadFilesSync(join(__dirname, '../graphql/gql/**/*.graphql')),
);
