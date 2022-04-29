const gulp = require('gulp');

const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');

gulp.task('css',function(){
    console.log(`minifying css `);
    gulp.src('./assets/css/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.mincss'))

    return gulp.src('./assets.mincss/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets/css'));

})