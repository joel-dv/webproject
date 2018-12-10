// Gulpfile.js running on stratumui, 
// a css framework available on npmjs.com
var gulp 	= require('gulp'),
  	sass 	= require('gulp-sass'),
  	concat 	= require('gulp-concat'),
  	uglify 	= require('gulp-uglify'),
  	rename 	= require('gulp-rename'),
    newer   = require('gulp-newer');
    //browserify = require('browserify'),
    //source = require('vinyl-buffer');

// ... other includes
var browserSync = require("browser-sync").create();

var paths = {
  styles: {
    src: 'src/scss/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/img/'
  },
  php: {
    src: 'src/*.php',
    dest: 'dist/'
  }
};

function styles() {
  return gulp
  	.src(paths.styles.src, {
      sourcemaps: true
    })
	.pipe(sass())
	.pipe(rename({
	  basename: 'main',
	  suffix: '.min'
	}))
.pipe(gulp.dest(paths.styles.dest))
.pipe(browserSync.stream());
}

function scripts() {
  return gulp
	.src(paths.scripts.src, {
		sourcemaps: true
	})
  //return browserify('./source/js/main.js')
  //.bundle()
  //.pipe(source('bundle.js'))
  //.pipe(buffer())
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream());
}

// Images Task
function images() {
    return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// PHP Task
function php() {
    return gulp
    .src(paths.php.src)
    .pipe(newer(paths.php.dest))
    .pipe(gulp.dest(paths.php.dest))
    .pipe(browserSync.stream());
}

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

function watch() {
  browserSync.init({
        //server: {
          //  baseDir: "./public"
        //}
        // Using Apache on localhost
        proxy: "localhost/~joel/default_project/dist"
    });
  gulp
	  .watch(paths.scripts.src, scripts);
  gulp
  	.watch(paths.styles.src, styles);
  gulp
    .watch(paths.images.src, images);
  gulp
    .watch(paths.php.src, php);
  gulp
    .watch(paths.php.dest+"*.php", reload);
}

var build = gulp.parallel(styles, scripts, images, php, reload, watch);

gulp
  .task(build);
gulp
  .task('default', build);