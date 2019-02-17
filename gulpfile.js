//Requirements to build the gulp js file
var gulp = require('gulp');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var autoprefixer = require('autoprefixer');
var clean = require('gulp-clean');
var wpPot = require('gulp-wp-pot');
var sort = require('gulp-sort');
var zip = require('gulp-zip');
var plumber = require('gulp-plumber');
var argv = require('yargs').argv;
var gulpUtil = require('gulp-util');
var del = require('del');
var path = require('path');
var uglify = require('gulp-uglify');
var fs = require("fs");
var log = require('fancy-log');
var gulpFn  = require('gulp-fn');
var babel = require('gulp-babel');
var babelMinify = require('gulp-babel-minify');
var replace = require('gulp-string-replace');
var uglifycss = require('gulp-uglifycss');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var colorize = require('chalk');
var notify = require("gulp-notify");
var babelify = require("babelify");
var browserify = require("browserify");

// Webpack paths
var CSS_SOURCE_DIR = path.resolve(__dirname, 'css');
var CSS_BUILD_DIR = path.resolve(__dirname, 'dist/css');
var JS_SOURCE_DIR = path.resolve(__dirname, 'js');
var JS_BUILD_DIR = path.resolve(__dirname, 'dist/js');

var languagePaths = [
	'src/**/*.mo',
	'src/**/*.po',
];


// set clean paths
var cleanPaths = [
	'dist/*',
	'dist/node_modules',
	'dist/test',
	'simple-comment-editing-options.zip'
];

var phpPaths = [
	'**/*.php',
	'!node_modules',
	'!tests',
	'!dist/**/*.php'
];

var jsPaths = [
	'/js/*.js',
	'!node_modules',
	'!tests',
	'!dist/js/*.js'
];

var imgPaths = [
	'**/*.png',
	'**/*.gif',
	'**/*.jpg',
	'**/*.svg',
	'!dist/**/*.png',
	'!dist/**/*.gif',
	'!dist/**/*.jpg',
	'!dist/**/*.svg',
	'!node_modules',
	'!tests',
];

var scssPaths = [
	'css/**/*.scss',
	'!/dist/css/**/*.scss',
	'!node_modules',
	'!tests',
];

var cssPaths = [
	'css/*.css',
	'!dist/css/*.css',
	'!node_modules',
	'!tests',
];

var htmlPaths = [
	'**/*.html',
	'!dist/**/*.html',
	'!node_modules',
	'!tests',
];

var miscPaths = [
	'**/*.txt',
	'**/*.md',
	'.babelrc',
	'!node_modules',
	'!tests',
];

var babelPaths = [
	'js/*.js',
	'!dist/js/*.js',
	'!node_modules',
	'!tests',
];

//build type
gulp.task('build_type', function(){
	console.log('====','Building Free','====')
});

/* ==Start Gulp Process=== */
gulp.copy = function (src, dest) {
	return gulp.src([src, '!node_modules', '!tests'], { base: "." })
		.pipe(plumber(reportError))
		.pipe(gulp.dest(dest));
};

/* ==Translations=== */
gulp.task('pot', function () {
	return gulp.src(['**/*.php', '**/*.js', '!dist/**/*.php', '!dist/**/*.js'])
	.pipe(plumber(reportError))
	.pipe(sort())
	.pipe(wpPot({
		domain: 'simple-comment-editing-options',
		destFile:'simple-comment-editing-options.pot',
		package: 'Simple Comment Editing Options',
		bugReport: 'https://github.com/ronalfy/simple-comment-editing-options',
		lastTranslator: 'Ronald Huerca <ronald@mediaron.com>',
		team: 'Ronald Huereca <ronald@mediaron.com'
	}))
	.pipe(gulp.dest('languages'))
	.pipe(gulp.dest('dist/languages'));
});

/* ==Translations=== */
gulp.task('move_mo_files', function () {
	return gulp.src(['**/*.mo', '!dist/**/*.mo'])
	.pipe(plumber(reportError))
	.pipe(sort())
	.pipe(gulp.dest('dist/'));
});

/* ==Translations=== */
gulp.task('move_po_files', function () {
	return gulp.src(['**/*.po', '!dist/**/*.po'])
	.pipe(plumber(reportError))
	.pipe(sort())
	.pipe(gulp.dest('dist/'));
});

/* ===Sorting SCSS=== */
gulp.task('scss_compile', function(){
	return gulp.src(scssPaths)
	.pipe(plumber(reportError))
	.pipe(sourcemaps.init())
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
  	.pipe(sass())
	.pipe(plumber(reportError))
	.pipe(uglifycss({'maxLineLen': 0, 'uglyComments': true}))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('.'))
	.pipe(plumber.stop())
	.pipe(gulp.dest('css'))
	.pipe(gulp.dest('dist/css'));
});

/* ==CSS== */
gulp.task('css_move', function () {
	return gulp.src(cssPaths)
		.pipe(plumber(reportError))
		.pipe(gulp.dest('css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('css_min', function() {
	return gulp.src(cssPaths)
        .pipe(sourcemaps.init())
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('css'))
        .pipe(gulp.dest('dist/css'));
});

/* ==JS== */
gulp.task('js_move', function () {
    return gulp.src(jsPaths)
        .pipe(plumber(reportError))
        .pipe(gulp.dest('dist/js'));
});

/* ==Images=== */
gulp.task('imgs_move', function () {
	return gulp.src(imgPaths)
		.pipe(plumber(reportError))
		.pipe(gulp.dest('dist'));
});

/* ==TXT=== */
gulp.task('misc_move', function () {
	return gulp.src(miscPaths)
		.pipe(plumber(reportError))
		.pipe(gulp.dest('dist'));
});


// /* ==Sorting HTML=== */
gulp.task('html_move', function () {
	return gulp.src(htmlPaths)
		.pipe(plumber(reportError))
		.pipe(gulp.dest('dist'));
});

// /* ====Sorting PHP======= */
gulp.task('php_move', function () {
	return gulp.src(phpPaths)
		.pipe(plumber(reportError))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist_clean', function () {
  return del([
    'dist/node_modules/',
    'dist/tests/',
  ]);
});


/* ===========Babel============== */

gulp.task("babel", function () {
    return gulp.src(babelPaths)
		.pipe(babel({ presets: ['idempotent-babel-polyfill', 'es2015', 'stage-0'] }))
        .pipe(gulp.dest("dist/js"));
});
gulp.task('babel_min', function(){
	return gulp.src(babelPaths)
		.pipe(sourcemaps.init())
		.pipe(babel({ sourceType :"module", presets: ['idempotent-babel-polyfill', 'es2015', 'stage-0'] }))
        .pipe(babelMinify())
        .pipe(plumber(reportError))
        .pipe(rename({suffix: '.min'}))
		.pipe(plumber(reportError))
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('check_upgrade_notice', function() {
    gulp.src('readme.txt')
      .pipe(gulpFn(function(file) {
			// Read the readme
			var text = fs.readFileSync('readme.txt', "utf8");

			// Grab the stable version number
			var stableTagRegex = /Stable tag: ([0-9.]*)/;
			var stableTagExec = stableTagRegex.exec(text);
			var stableTag = stableTagExec[1];

			// Check to make sure Stable Tag isnt blank / being picked up
			if (typeof stableTag != 'undefined' && stableTag) {
				log("check_upgrade_notice: Stable Tag: " + stableTag);
			} else {
				console.error("check_upgrade_notice: No Stable Tag Found");
				process.exit(1);
			}

			// Grab the upgrade notice value
			var upgradeNoticeRegex = /Upgrade Notice ==[\r\n]+\= ?([0-9.]*)/g;
			var upgradeNoticEexec = upgradeNoticeRegex.exec(text);
			var upgradeNotice = upgradeNoticEexec[1];

			// Check to make sure upgrade notice isnt blank / being picked up
			if (typeof upgradeNotice != 'undefined' && upgradeNotice) {
				log("check_upgrade_notice: Upgrade Notice: " + stableTag);
			} else {
				console.error("check_upgrade_notice: No Upgrade Notice Found");
				process.exit(1);
			}

			// Check if both versions match
			if (stableTag == upgradeNotice) {
				log("check_upgrade_notice: Both Tags Match");
				return;
			} else {
				console.error("check_upgrade_notice: Both Tags do not match.  Need to check");
				process.exit(1);
			}
		}));
});

/*== Configuring Zip ==*/
//for normal build
gulp.task('copy_for_zip', function () {
	return gulp.src('dist/**')
		.pipe(plumber(reportError))
		.pipe(gulp.dest('simple-comment-editing-options'));
});

gulp.task('build_zip', function () {
	return gulp.src('simple-comment-editing-options/**/*', { base: "." })
		.pipe(plumber(reportError))
		.pipe(zip('simple-comment-editing-options.zip'))
		.pipe(gulp.dest('.'));
});

gulp.task('clean_zip', function () {
	return gulp.src('simple-comment-editing-options', { read: false }).pipe(clean())
		.pipe(plumber(reportError));
});

/*== Clean Dist and Zip ==*/
gulp.task('clean', function () {
	return gulp.src(cleanPaths)
		.pipe(plumber(reportError))
		.pipe(clean({ force: true }));
});

gulp.task('clean_build', function () {
	return del(clean_build);
});

/*== Building the files ==*/
gulp.task('build', function (done) {
	runSequence(['clean'],
		['build_type'],
		['imgs_move', 'misc_move', 'html_move', 'php_move', 'scss_compile', 'css_move', 'css_min'],
		['babel', 'babel_min'],
		['check_upgrade_notice'],
		['pot'],
		['move_po_files', 'move_mo_files'],
		['dist_clean'],
		done
	);
});

/*== These tasks are ran to build gulp files ==*/

// ran with gulp build
gulp.task('default', function (done) {
	runSequence('clean','build', 'watch');
});

// ran with gulp deploy
gulp.task('deploy', function (done) {
	runSequence('clean','build', 'zip', done);
});

// Normal zip gulp
gulp.task('zip', function(done) {
	//check if we need to build with premium
	runSequence('copy_for_zip', 'build_zip', 'clean_zip', done);
});

/*== Watch ==*/
gulp.task('watch', function () {
	gulp.watch(phpPaths, { interval: 500 }, function (event) { file_watcher(event, '') });
	gulp.watch(jsPaths, { interval: 500 }, function (event) { file_watcher(event, '') });
	gulp.watch(cssPaths, { interval: 500 }, function (event) { file_watcher(event, '') });
	gulp.watch(htmlPaths, { interval: 500 }, function (event) { file_watcher(event, '') });
	gulp.watch(scssPaths, ['scss_compile']);
	gulp.watch(babelPaths, ['babel', 'babel_min']);
	gulp.watch(languagePaths, ['move_po_files', 'move_mo_files']);
});

// THis is an enhanced watch log to accuratly show which file has been changed
function file_watcher(event, version) {
    console.log('File ' + colorize.cyan(event.path) + ' was ' + colorize.magenta(event.type) + ' and ' + colorize.gray('moved') + ' to ' + colorize.gray('dist'));
    return gulp.src(event.path, { base: version })
        .pipe(plumber(reportError))
        .pipe(gulp.dest('dist'));
}

// Setup pretty error handling
var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    // Shows a pop when errors
    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    report += chalk('GULP TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
    console.error(report);
    // console.log(error);
    process.exit(1);
}