const gulp = require('gulp')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const realFavicon = require('gulp-real-favicon')
const del = require('del')
const fs = require('fs')

gulp.task('prpl-server:clean', () => {
  return del('server/build')
})

gulp.task('prpl-server:build', () => {
  const pattern = 'node_modules'
  const replacement = 'node_assets'
  const relhref = /href=(['"])(?!(https?:\/\/|\/))/g
  const abshref = 'href=$1/'

  return gulp.src('build/**')
    .pipe(rename((path) => {
      path.basename = path.basename.replace(pattern, replacement)
      path.dirname = path.dirname.replace(pattern, replacement)
    }))
    .pipe(replace(pattern, replacement))
    .pipe(replace(relhref, abshref))
    .pipe(gulp.dest('server/build'))
})

gulp.task('prpl-server', gulp.series(
  'prpl-server:clean',
  'prpl-server:build'
))