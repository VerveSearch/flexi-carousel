var gulp = require('gulp'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),
	PATHS = {
		JS:{
			SRC:['./src/*.js','./src/**/*.js'],
			DIST:'./dist'
		}
	},
	PluginName = 'flexi-carousel';

function onError(err){
	console.log('An error has occured: ',err);
}

gulp.task('jshint',function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(jshint())
		.pipe(jshint.reporters(stylish)); 
});

gulp.task('concat',['jshint'],function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(concat(PluginName+'.js'))
		.on('error',onError)
		.pipe(gulp.dest(PATHS.JS.DIST))
		.on('error',onError)
		.pipe(concat(PluginName+'.min.js'))
		.on('error',onError)
		.pipe(uglify())
		.on('error',onError)
		.pipe(gulp.dest(PATHS.JS.DIST)); 
});

gulp.task('watch',['concat'],function(){
	return gulp.watch(PATHS.JS.SRC,['concat']); 
});

gulp.task('default','watch',function(){

});