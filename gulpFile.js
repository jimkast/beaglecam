'use strict';

var gulp = require('gulp');
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var karma = require('gulp-karma');
var flatten = require('gulp-flatten');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var replace = require('gulp-replace');


var applicationJavaScriptFiles,
    vendorJavaScriptFiles,
    vendorCSSFiles,
    applicationCSSFiles,
    applicationTestFiles,
    allImgs;

gulp.task('jshint', function() {
    gulp.src(['gulpFile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
    gulp.src(['public/modules/**/css/*.css'])
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter());
});

gulp.task('nodemon', function(done) {
    nodemon({
        script: 'server.js',
        env: {
            'NODE_ENV': 'development'
        }
    })
        .on('restart');
});


gulp.task('cleandist', function() {
    // return gulp.src('./public/dist/*', {read: false})
    //     .pipe(clean({force:true}));

    return gulp.src('./public/dist/modules/*', {read: false})
        .pipe(clean({force:true}));
});


gulp.task('copyImages', function() {
    return gulp.src(['./public/modules/**/img/**'], {base:'./public'})
        // .pipe(gulp.dest('./public/dist'))
        .pipe(flatten())
        .pipe(gulp.dest('./public/dist/img'));
});

gulp.task('copyViews', function() {


    return gulp.src('./public/modules/**', {base: './public'})
        // .pipe(minifyHTML())
        .pipe(gulp.dest('./public/dist'));
        
    // gulp.src('./public/dist/modules/**/*.js', {read: false})
    //     .pipe(clean({force:true}));


});


gulp.task('removeJs', function() { 
    // return gulp.src('./public/dist/modules/*/*.js', {read: false})
    //     .pipe(clean({force:true}));

});





gulp.task('copyLib2', function() {
    return gulp.src('./public/lib2/*', {base: './public'})
        .pipe(gulp.dest('./public/dist'));

});


gulp.task('uglify', function() {

    gulp.src(vendorJavaScriptFiles)
        .pipe(uglify('vendor.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('public/dist/js'));

    gulp.src(applicationJavaScriptFiles)
        .pipe(uglify('application.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('cssmin', function() {
    gulp.src(vendorCSSFiles)
        .pipe(concat('vendor.css'))
        .pipe(minifyCSS())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest('public/dist/css'));

    gulp.src(applicationCSSFiles)
        .pipe(concat('application.css'))
        .pipe(minifyCSS())
        .pipe(rename('application.min.css'))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('mochaTest', function() {
    process.env.NODE_ENV = 'test';
    gulp.src(['server.js', 'app/tests/**/*.js'])
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('karma', function() {
    gulp.src(applicationTestFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(['gulpFile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'], ['jshint']);
    gulp.watch(['public/**/css/*.css'], ['csslint']);

    gulp.watch(['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/modules/**/views/*.html', 'public/js/**/*.js', 'public/modules/**/*.js', 'public/**/css/*.css']).on('change', function(file) {
        server.changed(file.path);
    });
});

gulp.task('loadConfig', function() {
    var init = require('./config/init')();
    var config = require('./config/config');
    vendorJavaScriptFiles = config.assets.lib.js;
    applicationJavaScriptFiles = config.assets.js;
    vendorCSSFiles = config.assets.lib.css;
    applicationCSSFiles = config.assets.css;
    applicationTestFiles = config.assets.lib.js.concat(config.assets.js, config.assets.tests);

});

// Default task(s).
gulp.task('default', ['jshint', 'csslint', 'nodemon', 'watch']);

// Lint task(s).
gulp.task('lint', ['jshint', 'csslint']);

// Build task(s).
// gulp.task('build', ['loadConfig', 'uglify', 'cssmin', 'copyViews', 'removeJs', 'copyImages']);
gulp.task('build', ['loadConfig', 'uglify', 'cssmin', 'copyImages']);

// Test task.
gulp.task('test', ['loadConfig', 'mochaTest', 'karma']);
