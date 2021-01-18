/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 18:16:36
 * @FilePath: \foodPlatform\gulpfile.js
 * @LastEditTime: 2021-01-18 18:43:58
 */
const gulp = require('gulp');
const del = require('del');
// 编译同时复制到dist目录
function copy() {
  return gulp.src('src/graphql/gql/*').pipe(gulp.dest('dist/graphql/gql'));
}

function clean(cb) {
  return del(['dist', 'yarn-error.log'], cb);
}
module.exports = {
  default: copy,
  copy,
  clean,
};
