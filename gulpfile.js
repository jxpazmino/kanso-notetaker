'use strict';

function onError(err) {
  console.log(err);
  this.emit('end');
}

var gulp 		 = require('gulp'),
	uglify 		 = require('gulp-uglify'),
	gutil		 = require('gulp-util'),
	gulpif 		 = require('gulp-if'),
	htmlmin      = require('gulp-htmlmin'),
	sass		 = require('gulp-sass'),
    concat       = require('gulp-concat'),
    jade		 = require('gulp-jade'),
	plumber 	 = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync  = require('browser-sync').create(),
    sassStyle,
    env,
    htmlPretty,
    outputDir;
    
env = process.env.NODE_ENV || 'development';
// env = 'production';
if(env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
	htmlPretty = true;
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
	htmlPretty = false;
}
    
var jsSources = ['components/scripts/*.js'],
    sassSources = ['components/sass/*.scss'],
    jadeSources = ['components/jade/*.jade'];

gulp.task('js', function() {
    return gulp.src(jsSources)
    .pipe(concat('bundle.js'))
	.pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('sass', function() {
	return gulp.src(sassSources)
	.pipe(sass({
		outputStyle: sassStyle
	}))
	.on('error', onError)
    .pipe(autoprefixer({
			browsers: ['last 2 versions', 'IE 9'],
			cascade: false
		}))
	.pipe(gulp.dest(outputDir + 'css'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'jade'], function() {

    browserSync.init({
        // server: "./app"
		proxy: "localhost:8000"
    });

    gulp.watch(sassSources[0], ['sass']).on('change', browserSync.reload);
    gulp.watch('components/jade/**/*.jade', ['jade']).on('change', browserSync.reload);
});

// gulp.task('html', function() {
// 	return gulp.src('builds/development/*.html') //always read index @dev
// 	.pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
// 	.pipe(gulpif(env === 'production', gulp.dest(outputDir)));
// });

gulp.task('jade', function() {
  return gulp.src(jadeSources)
    .pipe(jade({
    	pretty: htmlPretty
    }))
	// .pipe(plumber())
	.on('error', onError)
    .pipe(gulp.dest(outputDir))
});

gulp.task('default', ['jade', 'sass']);
