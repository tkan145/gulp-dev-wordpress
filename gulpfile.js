/**		
 * ATTheme.		
 *		
 * This file adds gulp tasks to the Wordpress custom theme.		
 *		
 * @author An Tran
 */

// Variables
var themename = '',
    root = '../' + themename + '/';

// Dependencies
var args        = require('yargs').argv,
    autoprefixer= require('autoprefixer'),
    babel       = require("gulp-babel"),
    browsersync = require('browser-sync'),
    bump        = require('gulp-bump'),
    cache       = require('gulp-cached'),
    cleancss    = require('gulp-clean-css'),
    csscomb     = require('gulp-csscomb'),
    cssnano     = require('gulp-cssnano'),
    filter      = require('gulp-filter'),
    mqpacker    = require('css-mqpacker'),
    gulp        = require('gulp'),
    notify      = require('gulp-notify'),
    pixrem      = require('gulp-pixrem'),
    plumber     = require('gulp-plumber'),
    postcss     = require('gulp-postcss'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    focus       = require('postcss-focus');

// Assets Path
var paths = {
    all:        [],
    concat:     [],
    images:     ['assets/images/*','!assets/images/*.svg'],
    php:        ['./*.php','./**/*.php','./**/**/*.php'],
    scripts:    ['assets/scripts/*.js','!assets/scripts/min'],
    styles:     ['assets/styles/*.scss', '!assets/styles/min/']
};

/**
 * Compile Sass
 */
gulp.task('styles', function (){
    gulp.src(root + 'assets/scss/style.scss')

        // Notify on error.
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        
        // Source maps init
		.pipe(sourcemaps.init())

        // Process sass
		.pipe(sass({
			outputStyle: 'expanded'
        }))
        
        // Pixel fallbacks for rem units.
        .pipe(pixrem())
        
        // Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: 'last 2 versions'
			}),
			mqpacker({
				sort: true
			}),
			focus(),
        ]))
        
        // Format non-minified stylesheet.
		.pipe(csscomb())

		// Output non minified css to theme directory.
        .pipe(gulp.dest('./'))
        
        // Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
        }))
        
        // Process sass again.
		.pipe(sass({
			outputStyle: 'compressed'
        }))
        
        // Combine similar rules.
		.pipe(cleancss({
			level: {
				2: {
					all: true
				}
			}
        }))
        
        // Minify and optimize style.css again.
		.pipe(cssnano({
			safe: false,
			discardComments: {
				removeAll: true,
			},
        }))
        
        // Add .min suffix.
		.pipe(rename({
			suffix: '.min'
		}))

		// Write source map.
		.pipe(sourcemaps.write('./'))

		// Output the compiled sass to this directory.
        .pipe(gulp.dest('assets/styles/min'))
        
        // Filtering stream to only css files.
		.pipe(filter('**/*.css'))

		// Notify on successful compile (uncomment for notifications).
		.pipe(notify("Compiled: <%= file.relative %>"));

})


/**
 * Minify js file
 */
gulp.task('scripts', function() {

    gulp.scr(root + paths.scripts)
        
        // Notify on error.
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
        }))

        // Source maps init
        .pipe(sourcemaps.init())
        
        // Using babel to transpile ES6 
        .pipe(babel({
            "presets": ["env"]
        }))
        
        // Cache files to avoid processing files that haven't changed.
        .pipe(cache('scripts'))
        
        // Add .min suffix.
		.pipe(rename({
			suffix: '.min'
        }))
        
        // Minify.
		.pipe(uglify())

        .pipe(sourcemaps.write())

		// Output the processed js to this directory.
        .pipe(gulp.dest('assets/scripts/min'))
        
        // Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
		}))

		// Notify on successful compile.
		.pipe(notify("Minified: <%= file.relative %>"));

});

/**
 * Optimize images
 */
gulp.task('images', function(){
    return gulp.src(root + paths.images)

        // Notify on error.
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		// Cache files to avoid processing files that haven't changed.
        .pipe(cache('images'))

        // Optimize images.
		.pipe(imagemin({
			progressive: true
		}))
        
        // Output the optimized images to this directory.
		.pipe(gulp.dest('assets/images'))

		// Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
		}))

		// Notify on successful compile.
		.pipe(notify("Optimized: <%= file.relative %>"));

});

/**
 * Scan the theme and create a POT file.
 */
gulp.task('i18n', function () {
    return gulp.src(root + paths.php)

        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))

        .pipe(sort())

        .pipe(wpPot({
			domain: 'attheme',
			destFile: 'attheme.pot',
			package: 'ATTheme',
			lastTranslator: 'An Tran <tkan145@gmail.com>',
        }))

		.pipe(gulp.dest('./languages/'));
});

/**
 * Watch file change
 */
gulp.task('watch', function () {

    browsersync( {
		proxy: 'localhost/BoosterAI',
		browser: '/Applications/Firefox\ Developer\ Edition.app'
	 } );

    gulp.watch(root + paths.styles, ['styles']);
    gulp.watch(root + paths.scripts, ['scripts']);
    gulp.watch(root + paths.images, ['images']);
    gulp.watch(root + paths.php).on('change',  browsersync.reload);

});

/**
 * Package theme.
 */
gulp.task('zip', function(){
    gulp.src(['./**/*', '!./node_modules/', '!./node_modules/**', '!./aws.json'])
		.pipe(zip(__dirname.split("/").pop() + '.zip'))
		.pipe(gulp.dest('../'));
});

// /**
//  * Rename Theme
//  */

/**
 * Bump version
 */
gulp.task('bump', function(){
    
    if(args.major) {
        var kind = 'major';
    }

    if(args.minor) {
        var kind = 'minor';
    }

    if(args.patch) {
        var kind = 'patch';
    }

    gulp.src(['./package.json'])
        .pipe(bump({
            type: kind,
            version: args.to
        }))
        .pipe(gulp.dest('./'));

    gulp.src([ root + './style.css'])
        .pipe(bump({
            type: kind,
            version: args.to
        }))
        .pipe(gulp.dest(root + './'));

    gulp.src([root + './functions.php'])
		.pipe(bump({
			key: "'CHILD_THEME_VERSION',",
			type: kind,
			version: args.to
		}))
        .pipe(gulp.dest(root + './'));
        
    gulp.src('./assets/sass/style.scss')
		.pipe(bump({
			type: kind,
			version: args.to
		}))
		.pipe(gulp.dest('./assets/styles/'));
})

/**
 * Default task
 */
gulp.task('default',['watch'],function(){
    gulp.start('styles', 'scripts', 'images');
})