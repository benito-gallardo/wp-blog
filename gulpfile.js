var gulp = require('gulp'),
  ejs = require('gulp-ejs'),
  rename = require('gulp-rename'),
  del = require('del'),
  blog = require('./lib/blogService'),
  helpers = require('./lib/helpers'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  bundle = require('gulp-bundle-assets'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence');

gulp.task('sass', function () {
  return gulp.src('src/assets/sass/**/*.scss')
    .pipe(sass({includePaths: ['./node_modules'], outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('build/assets/stylesheets/'))
    .pipe(browserSync.stream({match: '**/*.css'}));

});
gulp.task('blog:build', function() {
  del('./build'); // testing purposes
  var content = ['http://monored.us/volusion-test/wp-json/wp/v2/posts?filter[posts_per_page]=-1', 'http://monored.us/volusion-test/wp-json/wp/v2/pages?filter[posts_per_page]=-1'];
  content.forEach(function(url) {
    blog.getPosts(url).then(function(posts) { // success
      console.log(helpers.prettyJSON(posts));
      for (var i = 0, x = posts.length; i < x; i++) {
        createPage(posts[i]);
      }
    }, function(err) { // failure
      console.error(err);
    });
  });
});
//////////////////////////////////////////////////////////////////
// Concatenate & Minify JS

// Ignores files used for bundle task
gulp.task('globalScripts', function() {
    return gulp.src(['src/assets/js/global-scripts/*.js'])
        .pipe(concat('global.js'))
        .pipe(gulp.dest('build/assets/javascript'))
        .pipe(rename('global.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/javascript'))
        .pipe(browserSync.stream({match: '**/**/*.js'}));
});

// Uses bundle.config.js to find npm js files and bundles/uglifys them
gulp.task('bundleScripts', function() {
  return gulp.src('src/assets/js/global-admin/bundle.config.js')
    .pipe(bundle())
    .pipe(rename('global-admin.js'))
    .pipe(gulp.dest('build/assets/javascript'));
});

gulp.task('scripts', ['globalScripts', 'bundleScripts']);
/////////////////////////////////////////////////////////////////
// Browser-Sync
gulp.task('browser-sync', function() {
    browserSync.init({
        reloadDebounce: 5000,
        server: {
            baseDir: './build'
        }, 
        port: 8000,
        tunnel: false // only need to enable this if with a device not on the same wifi - crashes often so off by default
    });

    gulp.watch(['src/**/*.html'], function () {
        runSequence(
            'blog:build',
            browserSync.reload
        );
    });
});
/**
 * @param  {Array} post - The post that needs a page generated.
 * @return {N/A}
 */
function createPage(post) {
  gulp.src("./views/templates/blog/index.html")
    .pipe(ejs({
      post: post
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest("./build/ecommerce-blog/" + post.slug));
};
gulp.task('serve', function(callback){
  runSequence(['blog:build'], 'sass','scripts',
    'browser-sync',
    callback);
  });













