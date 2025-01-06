const {src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require("sass"))

const buildStyles = () => {
    return src('src/**/*.scss')
    .pipe(sass())
    .pipe(dest('./src/css'))
}

const watchTask = () => {
    watch(['src/*.scss', 'src/components/*.scss'], buildStyles)
}

exports.default = series(buildStyles, watchTask)