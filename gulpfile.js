const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const include = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require('browser-sync').create()
const log = require("fancy-log");
const del = require("del");
const concat = require("gulp-concat");
const rename = require('gulp-rename');

const clear = () => {
	return del('dist')
}

const scss = () => {
	return src('src/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			//includePaths: require("node-normalize-scss").with("dist")
		})
		.on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: true,
			grid: 'no-autoplace',
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/styles'))
		.on('finish', () => {
			log("scss compiled")
		});
}

const html = () => {
	return src([
		'src/*.html'
	])
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(dest('dist'))
		.on('finish', () => {
			log("html compiled")
		});
}

const script = () => {
	return src([
		'./node_modules/jquery/dist/jquery.js',
		'src/js/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat(`script.min.js`))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/js'))
		.on('finish', () => {
			log("scripts concated")
		});
}



const normalize = () => {
	return src('./node_modules/normalize.css/normalize.css')
		//.pipe(rename('_normalize.scss'))
		.pipe(dest('dist/styles'))
		.on('finish', () => {
			log("normalize copied")
		});
	
}

const copy = () => {
  return src('src/images/**/*.*', {base:"./src/"})
		.pipe(dest('dist'))
		.on('finish', () => {
			log("images copied")
		});
}

const serve = () => {
	browserSync.init({
		server: './dist'
	})
	
	watch('src/**/*.html', series(html)).on('change', browserSync.reload)
	watch('src/styles/**/*.scss', series(scss)).on('change', browserSync.reload)
	watch('src/js/**/*.js', series(script)).on('change', browserSync.reload)
}

exports.serve = series(clear, scss, html, copy, normalize, script, serve)
exports.build = series(clear, scss, html, copy, normalize, script)
