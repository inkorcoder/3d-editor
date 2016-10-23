/**************************************************************

	Gulpfile.js - Gulp.js configuration file with synchronously 
	called tasks. 

	-------------------------------------------------------------

	Javascript is synchronous language, so you can have a problem
	with reloading server after cahnging your files. The problem 
	is that task is not waiting for compiling all files and run 
	page with old files. After that you have not see the changes 
	and must save files again or reload page manually.

	This config fix this problem.

	-------------------------------------------------------------

	IMPORTANT: reloading page can be slower then usual.

	-------------------------------------------------------------

	Packages: gulp, gulp-connect, gulp-coffee, gulp-sass,
						colors, gulp-include, gulp-cssmin, gulp-rename,
						gulp-plumber, gulp-autoprefixer, gulp-jsmin

	Installation: "sudo npm i gulp gulp-connect gulp-coffee \
						gulp-sass colors gulp-include gulp-cssmin \
						gulp-rename gulp-plumber gulp-autoprefixer \
						gulp-jsmin"

	-------------------------------------------------------------

	Author: inkor, 2016

**************************************************************/

var PATH = '';

var OPTIONS = {
	notices: 					true,
	host: '						localhost',
	port: 						1111,
	livereload: 			true,
	root: 						[PATH+'dist'],
	coffeeWrapping: 	true,
	prefixing: 				[
											'Chrome > 30', 'Firefox > 20',
											'Explorer > 8', 'Opera > 12',
											'Edge > 10', 'iOS > 5'
										]
};

/*
		modules
*//* --------------------------------------------------------*/
var gulp 					= require('gulp'),
		// server + livereload
		connect 			= require('gulp-connect'),
		// coffeescript
		coffee 				= require('gulp-coffee'),
		// sass
		sass 					= require('gulp-sass'),
		// colored console log
		colors 				= require('colors'),
		// files including
		fileinclude 	= require('gulp-include'),
		// css minification
		cssmin 				= require('gulp-cssmin'),
		// renaming
		rename 				= require('gulp-rename'),
		// prevent gulp crashing after error
		plumber 			= require('gulp-plumber'),
		// css autoprefixer
		autoprefixer 	= require('gulp-autoprefixer'),
		// Javascript minification
		jsmin 				= require('gulp-jsmin'),
		// run system command (bash)
		exec 					= require("child_process").exec;


/*
		execute(command[, callback])
		* command [str] - string like 'notify-send hello-world'
		* callback [fn] - callback function (optional)
*//* --------------------------------------------------------*/
var execute = function(command, callback){
	// run command
	exec(command, function(error, stdout, stderr){
		// and run callback if exists
		if (callback){
			callback(stdout);
		}
	});
};
// log start message
execute("notify-send 'Gulp.js' 'Gulp was started' -i dialog-apply");


/*
		logSASS(err)
		* err [obj] - error object taken from gulp-plumber
*//* --------------------------------------------------------*/
var logSASS = function(err) {
	// replace excess info
	var mess = err.message.replace(/(\n|\r|Current dir:)/gim, '');
	// log system notification if notifying is enabled
	if (OPTIONS.notices === true) {
		execute("notify-send 'SASS' '" + mess + "' -i dialog-no", function() {});
	}
	// log message into terminal
	console.log("\n\r"+
		colors.grey("[ ")+(colors.red('ERROR!'))+colors.grey(" ]")+" SASS\r\n"+
		(colors.red(mess))+"\r\n"
	);
};


/*
		logCoffeeScript(err)
		* err [obj] - error object taken from gulp-plumber
*//* --------------------------------------------------------*/
var logCoffeeScript = function(err) {
	// replace excess info
	var mess = err.message.replace(/(\n|\r|Current dir:)/gim, '');
	// log system notification if notifying is enabled
	if (OPTIONS.notices === true) {
		execute("notify-send 'Coffeescript' '" + err.message + "\r\n → " + (err.stack.substr(0, err.stack.indexOf('error:'))) + "'  -i dialog-no", function() {});
	}
	// log message into terminal
	console.log("\n\r"+
		colors.grey("[ ")+(colors.red('ERROR!'))+colors.grey(" ]")+" CoffeeScript\r\n"+
		colors.red(mess)+colors.red(err.stack)+"\n\r"
	);
};


/*
		<connect> - run simple http-server with livereload
*//* --------------------------------------------------------*/
gulp.task('connect', function(){
	// create server
	connect.server({
		host: 			OPTIONS.host,
		port: 			OPTIONS.port,
		livereload: OPTIONS.livereload,
		root: 			OPTIONS.root
	});
});


/*
		<reload:js> - reload page after changing *js-files.
		Was called synchronously after <coffee> task.
*//* --------------------------------------------------------*/
gulp.task('reload:js', ['coffee'], function(){
	return gulp.src(PATH+'dist/js/**/*js')
		.pipe(connect.reload())
});


/*
		<reload:css> - reload page after changing *css-files
		Was called synchronously after <scss> task.
*//* --------------------------------------------------------*/
gulp.task('reload:css', ['scss'], function(){
	return gulp.src(PATH+'dist/css/*css')
		.pipe(connect.reload())
});


/*
		<reload:html> - reload page after changing *html-files
		Was called synchronously after <html> task.
*//* --------------------------------------------------------*/
gulp.task('reload:html', ['html'], function(){
	return gulp.src(PATH+'dist/*html')
		.pipe(connect.reload())
});


/*
		<coffee> - compile coffeescript files
*//* --------------------------------------------------------*/
gulp.task('coffee', function(){
	return gulp.src(PATH+'coffee/**/*coffee')
		// prevent an error
		.pipe(plumber({
			errorHandler: function(err){
				// send notificaiton
				logCoffeeScript(err);
			}
		}))
		.pipe(coffee({
			bare: 			OPTIONS.coffeeWrapping
		}))
		// non-minificated files
		.pipe(gulp.dest(PATH+'dist/js/full'))
		.pipe(jsmin())
		// minificated files
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(PATH+'dist/js'));
});


/*
		<scss> - compile SASS files
*//* --------------------------------------------------------*/
gulp.task('scss', function(){
	return gulp.src(PATH+'scss/**/*scss')
	// prevent an error
		.pipe(plumber({
			errorHandler: function(err){
				// send notificaiton
				logSASS(err);
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: 		false,
			browsers: 	OPTIONS.prefixing
		}))
		// non-minificated files
		.pipe(gulp.dest(PATH+'dist/css/full'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: 		'.min'
		}))
		// minificated files
		.pipe(gulp.dest(PATH+'dist/css'))
});


/*
		<html> - include html files and put into dest.
		USING:
			<section>
				#=include 'includes/myfile.html'
			</seciton>
*//* --------------------------------------------------------*/
gulp.task('html', function(){
	return gulp.src(PATH+'html/*.html')
		// prevent an error
		.pipe(plumber())
		// watch and include files
		.pipe(fileinclude())
		// put into dist
		.pipe(gulp.dest(PATH+'dist/'))
});


/*
		<watch> - watching for files changing
*//* --------------------------------------------------------*/
gulp.task('watch', function(){
	gulp.watch(PATH+'coffee/**/*coffee', 	['coffee', 'reload:js']);
	gulp.watch(PATH+'scss/**/*scss', 			['scss', 'reload:css']);
	gulp.watch(PATH+'html/**/*html', 			['html', 'reload:html']);
});


/*
		<default> - Main task. Running all tasks.
*//* --------------------------------------------------------*/
gulp.task('default', [
	'connect',
	'watch',
	'scss',
	'coffee',
	'reload:css',
	'reload:js',
	'reload:html'
]);