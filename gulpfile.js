const { src, dest, watch, series } = require("gulp");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const useref = require("gulp-useref");
const imagemin = require("gulp-imagemin");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();
const gulpStylelint = require("gulp-stylelint");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const async = require("async");
const iconfont = require("gulp-iconfont");
const consolidate = require("gulp-consolidate");

//  scss to css

function compileSass() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer("last 2 versions")]))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
}

//scss lint task
function scssLint() {
  return gulp.src("app/scss/**/*.scss").pipe(
    gulpStylelint({
      reporters: [
        {
          formatter: "string",
          console: true,
        },
      ],
    })
  );
}

function userefHtml() {
  return gulp
    .src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cleanCSS()))
    .pipe(gulp.dest("dist"));
}

//IMAGES
//  To solve the gulp error "[ERR_REQUIRE_ESM]: require() not supported", downgrade the version of the gulp-imagemin package to 7.1.0 by running the following command: npm install --save-dev gulp-imagemin@7.1.0 . This is the last version of gulp-imagemin that is built with CommonJS.
function handleImagesMin() {
  return gulp
    .src("app/images/**/*.+(png|jpg|gif|svg)")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}

// FONTS

function copyfonts() {
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
}

function Iconfont(done) {
  var iconStream = gulp.src(["app/svg/*.svg"]).pipe(
    iconfont({
      fontName: "myfont",
      fontHeight: 1001,
      normalize: true,
      formats: ["ttf", "eot", "woff", "woff2"],
    })
  );

  async.parallel(
    [
      function handleGlyphs(cb) {
        iconStream.on("glyphs", function (glyphs) {
          gulp
            .src("app/iconfont-template/iconfont.scss")
            .pipe(
              consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myfont",
                fontPath: "../fonts/",
                className: "s",
                fontDate: new Date().getTime(),
              })
            )
            .pipe(gulp.dest("app/scss/icon-font"))
            .on("finish", cb);
        });
      },
      function handleFonts(cb) {
        iconStream.pipe(gulp.dest("dist/fonts/")).on("finish", cb);
      },
    ],
    done()
  );
}

const browsersyncReload = (cb) => {
  browserSync.reload();
  cb();
};

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
  gulp.watch(
    ["app/scss/**/*.scss", "app/*.html", "app/js/**/*.js"],
    series(scssLint, compileSass, userefHtml, browsersyncReload)
  );
}

exports.default = series(
  handleImagesMin,
  copyfonts,
  Iconfont,
  userefHtml,
  watchFiles
);
