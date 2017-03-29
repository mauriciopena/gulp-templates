var
    gulp = require('gulp'),
    sass = require('gulp-sass');
    clean = require('gulp-clean');
    autoprefixer = require('gulp-autoprefixer');
    browserSync = require('browser-sync');
    reload = browserSync.reload;
    concat = require('gulp-concat');
    fontAwesome = require('node-font-awesome');

// source and distribution folder
var source = {
        root : 'src/',
        html : 'src/*.html',
        css : 'src/css/*.css',
        js : 'src/js/scripts.js',
        js_vendor : 'src/js/vendor/*.js',
        fonts : 'src/fonts/*.*',
        img : 'src/img/**'
    };

var dest = {
        root : 'dist/',
        html : 'dist/',
        css : 'dist/css/',
        js : 'dist/js/',
        fonts : 'dist/fonts',
        img : 'dist/img'
    };

// jquery source
var jquerySource = {
        in: './node_modules/jquery/dist/jquery.js'
    };

// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };

// fonts
var fonts = {
        in: [source.fonts, bootstrapSass.in + 'assets/fonts/**/*', fontAwesome.fonts],
        out: dest.fonts
    };

 // css source file: .scss files
var css = {
    in: source.root + 'scss/main.scss',
    out: dest.root + 'css/',
    watch: source.root + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precision: 8,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets', fontAwesome.scssPath]
    }
};

gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

//compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(css.in)        
        .pipe(sass(css.sassOpts))
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest(css.out));
});

gulp.task('scripts',  function() {
  gulp.src([jquerySource.in,
            bootstrapSass.in + 'assets/javascripts/bootstrap.js',
            source.js_vendor,
            source.js])
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(dest.js))
});

gulp.task('html', function() {
   return gulp.src(source.html)
        .pipe(gulp.dest(dest.root))
});

gulp.task('clean-html', function() {
  return gulp.src(dest.html+'*.html', {read: false, force: true })
      .pipe(clean());
});

gulp.task('images', function() {
    return gulp.src(source.img)
      .pipe(gulp.dest(dest.img));
});

gulp.task('clean-images', function() {
  return gulp.src(dest.img, {read: false, force: true })
      .pipe(clean());
});

gulp.task('serve', function() {
  browserSync.init([dest.css, dest.html + '/*.html', dest.js], {
    server: {
      baseDir : dest.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'scripts', 'images', 'html'], function() {
    gulp.watch(css.watch, ['sass']);
    gulp.watch(source.html, ['html', 'clean-html']);
    gulp.watch(source.img, ['images', 'clean-images']);
    gulp.watch(source.js, ['scripts']);
} );

gulp.task('default', ['watch']);
