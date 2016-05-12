var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    watch = require('gulp-watch');

// stylus
gulp.task('stylus', function () {
    gulp.src('./public/stylesheets/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('watch', function () {
    gulp.watch(['./public/stylesheets/*.styl'], ['stylus']);
});

gulp.task('default', ['watch']);