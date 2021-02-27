const gulp = require('gulp');
const del = require('del');
const replace = require('gulp-replace');
const zip = require('gulp-zip');
// 编译同时复制到dist目录
function copyGql() {
  return gulp.src(['src/graphql/gql/*']).pipe(gulp.dest('dist/graphql/gql'));
}
function copyPackage() {
  return gulp.src('package.json').pipe(replace(/src/g, '.')).pipe(gulp.dest('dist'));
}
function copyBin() {
  return gulp.src(['bin/.env', 'cert/*'], { base: '.' }).pipe(gulp.dest('dist'));
}

function clean(cb) {
  return del(['dist', 'yarn-error.log', '.eslintcache', 'test/__snapshots__/*'], cb);
}

function compress() {
  return gulp
    .src(['dist/**/*', '!dist/node_modules/**/*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
}

// 清除快照
function cleanTest(cb) {
  return del(['test/__snapshots__/*'], cb);
}
const copy = gulp.parallel(copyGql, copyPackage, copyBin);
module.exports = {
  default: copy,
  copy,
  clean,
  cleanTest,
  compress,
};
