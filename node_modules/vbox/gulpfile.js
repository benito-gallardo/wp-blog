'use strict';

var gulp = require('gulp'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		del = require('del');

/*
	Deletes js/bin directory
*/
gulp.task('clean', function(cb){
	del(['js/bin'], cb);
});


/*
	Concatonates and minifies mbox-materialize JS files ORDER MATTERS!
	Output: js/bin/mbox-materialize.js && js/bin/mbox-materialize.min.js
*/
gulp.task('js', function(){
	return gulp.src([
			"js/initial.js",
			"js/jquery.easing.1.3.js",
			"js/animation.js",
			"js/velocity.min.js",
			"js/hammer.min.js",
			"js/jquery.hammer.js",
			"js/global.js",
			"js/collapsible.js",
			"js/dropdown.js",
			"js/leanModal.js",
			"js/materialbox.js",
			"js/materialboxgallery.js",
			"js/parallax.js",
			"js/tabs.js",
			"js/tooltip.js",
			"js/waves.js",
			"js/toasts.js",
			"js/sideNav.js",
			"js/scrollspy.js",
			"js/forms.js",
			"js/slider.js",
			"js/cards.js",
			"js/chips.js",
			"js/pushpin.js",
			"js/buttons.js",
			"js/transitions.js",
			"js/scrollFire.js",
			"js/date_picker/picker.js",
			"js/date_picker/picker.date.js",
			"js/character_counter.js",
			"js/carousel.js"])
		.pipe(concat('materialize.js'))
		.pipe(gulp.dest('js/bin'))
		.pipe(rename('materialize.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/bin'));
});

gulp.task('build', ['clean', 'js']);



