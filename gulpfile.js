// Gulpfile.js running on stratumui, 
// a css framework available on npmjs.com
var gulp 	= require('gulp'),
  	sass 	= require('gulp-sass'),
  	concat 	= require('gulp-concat'),
  	uglify 	= require('gulp-uglify'),
  	rename 	= require('gulp-rename'),
    newer   = require('gulp-newer');
    csso   = require('gulp-csso');
    size = require("gulp-size");
    //browserify = require('browserify');
    //source = require('vinyl-buffer');

// ... other includes
var browserSync = require("browser-sync").create();

var paths = {
  comjs: {
    jquery: 'node_modules/jquery/dist/jquery.min.js',
    bootstrap: 'node_modules/bootstrap/dist/js/bootstrap.min.js'
  },
  styles: {
    bootstrap: './node_modules/bootstrap/dist/css/bootstrap.min.css',
    src: './src/scss/*.scss',
    dest: 'dist/assets/css/'
  },
  scripts: {
    vendors: 'src/js/vendors/*.js',
    src: 'src/js/*.js',
    dest: 'dist/assets/js/'
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/assets/img/'
  },
  pages: {
    src: 'src/views/pages/*.php',
    dest: 'dist/application/views/pages/'
  },
  templates: {
    src: 'src/views/templates/*.php',
    dest: 'dist/application/views/templates/'
  }
};

const SIZE_OPTS = {
  showFiles: true,
  gzip: true
};


function buildcomjs() {

  return gulp.src(paths.comjs.jquery, paths.comjs.bootstrap)
        // Log each file that will be concatenated into the common.js file.
        .pipe(size(SIZE_OPTS))
        // Concatenate all files.
        .pipe(concat("common.min.js"))
        // Minify the result.
        .pipe(uglify())
        // Log the new file size.
        .pipe(size(SIZE_OPTS))
        // Save that file to the appropriate location.
        .pipe(gulp.dest(paths.scripts.dest));
}

function styles() {
  return gulp
  	.src(paths.styles.src, {
      sourcemaps: true
    })
	.pipe(sass())
  .pipe(csso())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
.pipe(gulp.dest(paths.styles.dest))
.pipe(browserSync.stream());
}

function scripts() {
  return gulp
	.src(paths.scripts.vendors, paths.scripts.src, {
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

// Pages Task
function pages() {
    return gulp
    .src(paths.pages.src)
    .pipe(newer(paths.pages.dest))
    .pipe(gulp.dest(paths.pages.dest))
    .pipe(browserSync.stream());
}

// Templates Task
function templates() {
    return gulp
    .src(paths.templates.src)
    .pipe(newer(paths.templates.dest))
    .pipe(gulp.dest(paths.templates.dest))
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
        proxy: "localhost/~joel/dev/dist"
    });
  gulp
	  .watch(paths.scripts.src, scripts);
  gulp
  	.watch(paths.styles.src, styles);
  gulp
    .watch(paths.images.src, images);
  gulp
    .watch(paths.pages.src, pages);
    gulp
    .watch(paths.templates.src, templates);
  gulp
    .watch(paths.pages.dest+"*.php", reload);
    gulp
    .watch(paths.templates.dest+"*.php", reload);
}

var build = gulp.parallel(buildcomjs, styles, scripts, images, pages, templates, reload, watch);

gulp
  .task(build);
gulp
  .task('default', build);