let gulp = require('gulp')
let concat = require('gulp-concat')
let uglify = require('gulp-uglify')

let javascriptFiles = [
	'./app.js',
	'./workouts/define.js',
	'./workouts/log.js',
	'./user/auth.js'
]

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles)
		.pipe(concat('bundle.js'))
		//squish all files into one file
		.pipe(uglify())
		.pipe(gulp.dest("./dist")) //save the bundle . js
})

//default task when gulp runs: bundle, starts web server then watches for changes

gulp.task('default', ['bundle'])

