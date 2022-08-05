const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// function for sass task

const scssTask = () => {
  return src('app/scss/style.scss', {sourcemaps: true})
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([cssnano()]))
  .pipe(dest('dist', {sourcemaps: '.'}));
}

// function for js task
const jsTask = () => {
  return src('app/js/script.js', {sourcemaps: true})
  .pipe(terser())
  .pipe(dest('dist', {sourcemaps: '.'}));
}

// browser sync task

const browsersyncServer = (cb) => {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

// browsersync reload
const browsersyncReload = (cb) => {
  browsersync.reload();
  cb();
}


// watchtask

const watchTask = () => {
  watch('*.html', browsersyncReload);
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// default gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServer,
  watchTask
);
