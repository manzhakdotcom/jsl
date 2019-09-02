const gulp = require('gulp');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
    root: './dist',
    templates: {
        pages: './src/views/pages/*.pug',
        src: './src/views/**/*.pug',
        dest: '.'
    },
    styles: {
        main: './src/styles/main.scss',
        src: './src/styles/**/*.scss',
        dest: './dist/css',
    },
    scripts: {
        src: './src/scripts/**/*.js',
        dest: './dist/js',
    }
};

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}


function clean() {
    return del(paths.root);
}

function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.templates.dest));
}

function styles() {
    return gulp.src(paths.styles.main)
            .pipe(sourcemaps.init())
            .pipe(postcss(require('./postcss.config')))
            .pipe(sourcemaps.write())
            .pipe(rename('main.min.css'))
            .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
            .pipe(concat('scripts.js'))
            //.pipe(babel({ presets: ['@babel/env'] }))
            //.pipe(uglify())
            .pipe(gulp.dest(paths.scripts.dest));
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, scripts),
    gulp.parallel(watch)
));