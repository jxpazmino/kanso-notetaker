'use strict';

var gulp 		 = require('gulp'),
	uglify 		 = require('gulp-uglify'),
	gulpif 		 = require('gulp-if'),
	htmlmin      = require('gulp-htmlmin'),
	sass		 = require('gulp-sass'),
    concat       = require('gulp-concat'),
    jade		 = require('gulp-jade'),
	// autoprefixer = require('gulp-autoprefixer'), // doesnt work with  my setup
    sassStyle,
    env,
    htmlPretty,
    outputDir;
    
env = process.env.NODE_ENV || 'development';
// env = 'production';
if(env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
	htmlPretty = false;
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
	htmlPretty = true;
}
    
var jsSources = ['components/scripts/smooth-scroll.js', 'components/scripts/script.js'],
    sassSources = ['components/sass/style.scss'],
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
    // .pipe(autoprefixer('last 2 versions')) // doesnt work with my setup
	.pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('html', function() {
	return gulp.src('builds/development/*.html') //always read index @dev
	.pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)));
});

gulp.task('jade', function() {
  return gulp.src(jadeSources)
    .pipe(jade({
    	pretty: jadePrettyHTML
    }))
    .pipe(gulp.dest(outputDir))
});

gulp.task('default', ['js', 'sass', 'jade', 'html']);
    