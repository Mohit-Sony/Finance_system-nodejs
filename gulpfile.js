const fs = require('fs')
const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const del = require('del')

const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');

gulp.task('css',function(done){
    console.log(`minifying css `);
    gulp.src('./assets/**/*.css')
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()

});

gulp.task('js',function(done){
    console.log(`minifying js..... `);
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
})

gulp.task('build' , gulp.series('clean:assets' , 'css' , 'js' ),function(done){
    console.log('building assets');
    done();
})
