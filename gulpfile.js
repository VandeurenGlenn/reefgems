const {task, series, src, dest} = require('gulp');
const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const {writeFileSync} = require('fs');
const injectHtmlTemplate = require('gulp-inject-html-template');
const merge = require('merge-stream');
const lwip = require('gulp-lwip');
const tap = require('gulp-tap');
const browserSync = require('browser-sync').create();
const reload = () => {
  return browserSync.reload;
};

// used to track the cache for subsequent rollup bundles
let cache;

task('html', () => {
  let app = src(['src/reef-gems-app.js'])
					.pipe(injectHtmlTemplate())
					.pipe(dest('.tmp'));
	let elements = src(['src/elements/**/*.js'])
					.pipe(injectHtmlTemplate())
					.pipe(dest('.tmp/elements'));

	return merge(app, elements);
});

task('rollup', () => {
  return rollup({
     entry: '.tmp/reef-gems-app.js',
     // Use the previous bundle as starting point.
     cache: cache
   }).then(bundle => {
      var result = bundle.generate({
        // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
        format: 'iife',
				moduleName: 'ReefGemsApp',
        plugins: [babel()]
      });
     // Cache our bundle for later use (optional)
     cache = bundle;

     writeFileSync('build/index.js', result.code);
   });
});

task('copy', () => {
  return src(['src/index.html']).pipe(dest('build'));
});

task('browserSync', () => {
	browserSync.init({
    port: 5000,
    ui: {
      port: 5001
    },
    server: {
      baseDir: ['build', 'bower_components'],
      index: 'index.html'
    }
  });

  browserSync.watch('src/**/*.html')
    .on('change', series('build', reload()));
  browserSync.watch('src/**/*.js')
    .on('change', series('build', reload()));
	browserSync.watch('src/**/*.{jpg,png}')
    .on('change', series('images', reload()));
});
// TODO: base64
task('resize', () => {
	const originals = src(['src/sources/**/*.{jpg,png}']);

	const a = src(['src/sources/**/*.{jpg,png}'])
					.pipe(lwip.rescale(320, 200).exportAs('png'))
					.pipe(tap(file => {
						if (file.basename.includes('jpg')) {
							file.basename = file.basename.replace('.jpg', '');
						}
						file.basename += '_320x200';
					}));

	const b = src(['src/sources/**/*.{jpg,png}'])
					.pipe(lwip.rescale(640, 480).exportAs('png'))
					.pipe(tap(file => {
						if (file.basename.includes('jpg')) {
							file.basename = file.basename.replace('.jpg', '');
						}
						file.basename += '_640x480';
					}));

	const c = src(['src/sources/**/*.{jpg,png}'])
					.pipe(lwip.rescale(800, 600).exportAs('png'))
					.pipe(tap(file => {
						if (file.basename.includes('jpg')) {
							file.basename = file.basename.replace('.jpg', '');
						}
						file.basename += '_800x600';
					}));

	const d = src(['src/sources/**/*.{jpg,png}'])
					.pipe(lwip.rescale(1024, 768).exportAs('png'))
					.pipe(tap(file => {
						if (file.basename.includes('jpg')) {
							file.basename = file.basename.replace('.jpg', '');
						}
						file.basename += '_1024x768';
					}));

	const e = src(['src/sources/**/*.{jpg,png}'])
					.pipe(lwip.rescale(1280, 800).exportAs('png'))
					.pipe(tap(file => {
						if (file.basename.includes('jpg')) {
							file.basename = file.basename.replace('.jpg', '');
						}
						file.basename += '_1280x800';
					}));

	const images = merge(originals, a, b, c, d, e);

	return images.pipe(dest('build/sources'));
});

task('images', series('resize'));
task('build', series('images', 'html', 'rollup', 'copy'));
task('serve', series('build', 'browserSync'))
task('default', series('build'));
