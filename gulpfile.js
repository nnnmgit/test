var gulp = require('gulp');

// engine
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nib = require('nib')

// utility
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

// browser sync
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// error
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

// data
var data = require("gulp-data");
var inject = require("gulp-inject");
var bowerFiles = require("main-bower-files");
var fs = require('fs'); // file system

// #####################################################################
// paths
// #####################################################################
var paths = {
    jadeFile:"./src/jade/*.jade",
    json:"./src/config/test.json"
};
var conf = {
	src: 'src',
	prod: false,
	bowerDir: '/bower_components/',
	dest: 'lib/'
}
// #####################################################################
// tasks
// #####################################################################
console.log("#####################################################################")

gulp.task('css', function() {
	console.log("task css =========")
	gulp.src('src/stylus/*')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(stylus({use: [nib()]}))
		.pipe(gulp.dest('./www/css/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(){

	console.log("task js =========")
	// bower filesをlibディレクトリにコピー
	gulp.src(bowerFiles())
		// .pipe(concat('bower_components.js'))
		// .pipe(uglify({preserveComments: 'some'}))
		.pipe(gulp.dest('www/lib/'))

	// source js fileをwww/jsにコピー
	gulp.src("src/js/*.js")
		// .pipe(concat(''))
		// .pipe(uglify({preserveComments: 'some'}))
		.pipe(gulp.dest('www/js/'))

})


gulp.task('jade', function() {
	console.log("task jade =========")
	var ignores = ['public/', 'client/'];


	var t = gulp.src(['src/jade/*', '!src/jade/_*'])
			.pipe(plumber({
				errorHandler: notify.onError('Error: <%= error.message %>')
			}))
			.pipe(data(function(file) {
				return JSON.parse(fs.readFileSync(paths.json, 'utf8'));		// requireだとキャッシュされるのでfs.readFileSync使う
				// delete require.cache[__dirname + paths.json]
				// return require(paths.json);
			}))
			.pipe(jade({pretty: true}))
			// .pipe(
			// 	inject(
			// 		gulp.src(
			// 			bowerFiles(), {
			// 				base: 'bower_components',
			// 				read: false
			// 			}
			// 		), {
			// 			ignorePath: ignores,
			// 			name: 'bower'
			// 		}
			// 	)
			// )

		// jsfile src
		// t.pipe(inject(gulp.src("./js/*.js", {
		// 	read: false
		// }), {
		// 	ignorePath: ignores,
		// 	name: 'bower'
		// }))


		// t.pipe(inject(gulp.src("lib/*.js", {
		// 	read: false
		// }), {
		// 	ignorePath: ignores,
		// 	name: 'inject_bower'
		// }))
		.pipe(gulp.dest('./www/'))
		// .on('end', reload)
		// .pipe(browserSync.reload({stream: true}));

	gulp.src('src/jade/_*')
		.pipe(browserSync.reload({stream: true}));

});


gulp.task('js_concat', function(){
	console.log("task js_concat =========")
	gulp.src('src/js/*')
		// .pipe(concat('all.js'))
		// .pipe(uglify({preserveComments: 'some'}))
		// .pipe(rename({
  //           suffix: '.min'
  //       }))
		// .pipe(gulp.dest('./www/js/'))
		// .pipe(browserSync.reload({stream: true}));
});

// #####################################################################
// watch
// #####################################################################
gulp.task('watch', function() {
	console.log("task watch =========")
	gulp.watch('src/stylus/*.styl', ['css']);
	gulp.watch(['src/jade/*.jade', paths.json],['jade']);
	gulp.watch('src/js/*.js',['js']);
	gulp.watch('www/index.html', ['inject'])
});

gulp.task('inject', function(){
	console.log("task inject =========")
	var target = gulp.src(['./www/*.html', '!./www/_*.html']);
	var sources = gulp.src(['www/lib/*.js', 'www/js/*.js'], {read: false});
	return target.pipe(inject(sources, {relative: true}))
	.pipe(gulp.dest('./www'))
	.on('end', reload)
	.pipe(browserSync.reload({stream: true}));
})

// BrowserSync
gulp.task('browser-sync', function() {
	console.log("task sync =========")
	browserSync({
		notify: false,
		port: 3000,
		server: {
			baseDir: ['./www/']
		},
		open: false // ブラウザ開かない
	});

});
gulp.task('default', ['watch', 'inject', 'browser-sync']);
