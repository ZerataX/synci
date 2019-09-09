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
  const relhref = /href=(['"])([^/])/g
  const abshref = 'href=$1/$2'
  const relhist = /window\.history\.(place|replace)State\((.+?[`'"]).*([`'"]), ([`'"])([^\/])/g
  const abshist = 'window.history.$1State($2$3, $4/$5'
  return gulp.src('build/**')
    .pipe(rename((path) => {
      path.basename = path.basename.replace(pattern, replacement)
      path.dirname = path.dirname.replace(pattern, replacement)
    }))
    .pipe(replace(pattern, replacement))
    .pipe(replace(relhref, abshref))
    .pipe(replace(relhist, abshist))
    .pipe(gulp.dest('server/build'))
})

gulp.task('prpl-server', gulp.series(
  'prpl-server:clean',
  'prpl-server:build'
))

// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'images/faviconData.json'

gulp.task('generate-favicon', function (done) {
  realFavicon.generateFavicon({
    masterPicture: 'images/icon.svg',
    dest: 'images/manifest',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#e270aa',
        margin: '0%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#e270aa',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#e270aa',
        manifest: {
          name: 'Synci',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true,
          start_url: '/',
          description: 'My App description'
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#e270aa'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done()
  })
})

gulp.task('check-for-favicon-update', function (done) {
  const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err
    }
  })
})
