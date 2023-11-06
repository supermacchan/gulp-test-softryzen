const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');
const mode = require('gulp-mode')();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const tailwindcss = require('tailwindcss');
const paths = require('../paths');

const css = () => {
  return gulp
    .src(paths.src.css)
    .pipe(
      plumber(
        notify.onError({
          title: 'CSS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(mode.development(sourcemaps.init()))
    .pipe(
      sass({
        sourceMap: true,
        precision: 3,
        errLogToConsole: true,
      }).on('error', sass.logError)
    )
    .pipe(
      mode.production(
        purgecss({
          content: ['src/**/*.{html,njk,js,json}'],
          skippedContentGlobs: ['node_modules/**'],
          defaultExtractor: content => {
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
            const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
            return broadMatches.concat(innerMatches);
          },
        })
      )
    )
    .pipe(
      postcss(
        [
          require('postcss-import')(),
          tailwindcss('./tailwind.config.js'),
          require('tailwindcss/nesting'),
          require('autoprefixer'),
        ],
        {
          parser: require('postcss-scss'),
        }
      )
    )
    .pipe(mode.production(gcmq()))
    .pipe(mode.production(cleanCSS()))
    .pipe(concat({ path: 'style.css' }))
    .pipe(size({ showFiles: true }))
    .pipe(mode.development(sourcemaps.write('./')))
    .pipe(gulp.dest(paths.build.css));
};

module.exports = css;
