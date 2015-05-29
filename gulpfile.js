var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nib = require('nib')

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

var data = require("gulp-data");
var inject = require("gulp-inject");
var bowerFiles = require("main-bower-files");
var fs = require('fs');

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
	bowerDir: '/bower_components/'
}
// #####################################################################
// tasks
// #####################################################################

gulp.task('css', function() {
	gulp.src('src/stylus/*')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(stylus({use: [nib()]}))
		.pipe(gulp.dest('./www/css/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('jade', function() {
	var ignores = ['public/', 'client/'];
	gulp.src('src/jade/*')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(data(function(file) {
			return JSON.parse(fs.readFileSync(paths.json, 'utf8'));		// requireだとキャッシュされるのでfs.readFileSync使う
			// delete require.cache[__dirname + paths.json]
			// return require(paths.json);
		}))
		.pipe(jade({pretty: true}))
		.pipe(inject(gulp.src(bowerFiles(), {
			base: '/test/',
			read: false
		}), {
			ignorePath: ignores,
			name: 'bower'
		}))
		.pipe(gulp.dest('./www/'))
		.on('end', reload)
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(){
	gulp.src('src/js/*')
		.pipe(concat('all.js'))
		// .pipe(uglify({preserveComments: 'some'}))
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('./www/js/'))
		.pipe(browserSync.reload({stream: true}));
});

// #####################################################################
// watch
// #####################################################################
gulp.task('watch', function() {
	gulp.watch('src/stylus/*.styl', ['css']);
	gulp.watch(['src/jade/*.jade', paths.json],['jade']);
	gulp.watch('src/js/*.js',['js']);
	// gulp.watch(paths.json, ['jade']);
	// gulp.watch('www/**', function(){
	// 	browserSync.reload();
	// });
});

// BrowserSync
gulp.task('browser-sync', function() {
	browserSync({
		notify: false,
		port: 3000,
		server: {
			baseDir: ['./www/']
		},
		open: false
	});
	// browserSync({
		// open: false
		// proxy: 'localhost:8012'
	// });

});
gulp.task('default', ['watch', 'browser-sync']);
