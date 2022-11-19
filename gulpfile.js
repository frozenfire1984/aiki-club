const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const include = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require('browser-sync').create()
const log = require("fancy-log");
const del = require("del");
const concat = require("gulp-concat");
const rename = require('gulp-rename');

const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const postcssRem = require('postcss-rem');
const postcssPresetEnv = require("postcss-preset-env");
const postcssUtilities = require('postcss-utilities');
const postcssCascadeLayers = require('@csstools/postcss-cascade-layers');

const clear = () => {
	return del('dist')
}

const scss = () => {
	return src(['src/styles/style.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
			outputStyle: 'expanded',
		})
		.on('error', sass.logError))
		.pipe(postcss([
			autoprefixer({grid: true}),
			postcssUtilities({ ie8: true }),
			//postcssCascadeLayers(),
			postcssRem({
				fallback: true,
			}),
		]))
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

const sanitize = () => {
	return src('./node_modules/sanitize.css/*.css')
		.pipe(concat('sanitize.build.css'))
		/*.pipe(postcss([
			postcssCascadeLayers({ onImportLayerRule: 'warn' }),
		]))*/
		.pipe(dest('dist/styles'))
		.on('finish', () => {
			log("sanitize copied")
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
		server: './dist',
	})
	
	watch('src/**/*.html', series(html)).on('change', browserSync.reload)
	watch('src/styles/**/*.scss', series(scss)).on('change', browserSync.reload)
	watch('src/js/**/*.js', series(script)).on('change', browserSync.reload)
}

exports.serve = series(clear, scss, html, copy, script, serve)
exports.build = series(clear, scss, html, copy, script)
