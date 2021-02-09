const gulp = require('gulp');
const del = require('del');
// 编译同时复制到dist目录
function copy() {
  return gulp.src('src/graphql/gql/*').pipe(gulp.dest('dist/graphql/gql'));
}

function clean(cb) {
  return del(['dist', 'yarn-error.log', '.eslintcache', 'test/__snapshots__/*'], cb);
}
// 清除快照
function cleanTest(cb) {
  return del(['test/__snapshots__/*'], cb);
}
module.exports = {
  default: copy,
  copy,
  clean,
  cleanTest,
};
