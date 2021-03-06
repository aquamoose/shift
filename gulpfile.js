var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify  = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('pug', function(){
	return gulp.src('app/pug/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('app/'));
});
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
});
gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});
gulp.task('clean:dist', function(){
	return del.sync('dist');
});

gulp.task('watch', function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/pug/*.pug', ['pug']);
});

gulp.task('build', function(callback){
	runSequence('clean:dist',
		['pug','sass','useref','images','fonts'],
		callback
	)
});
