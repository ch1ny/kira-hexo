const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const cp = require('child_process');
const path = require('path');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
	return gulp
		.src(['dist', 'bin/exe'], { read: false, allowEmpty: true })
		.pipe(clean(['dist', 'bin/exe']));
});

gulp.task('tsc', function () {
	return tsProject.src().pipe(tsProject()).pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('clean'), gulp.parallel('tsc')));
