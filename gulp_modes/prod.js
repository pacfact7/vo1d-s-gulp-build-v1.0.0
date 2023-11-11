const gulp = require("gulp");

// Плагины для HTML
const fileinclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");

// Плагины для CSS
const groupCSSMediaQueries = require("gulp-group-css-media-queries");
const sassGlob = require("gulp-sass-glob");
const csso = require("gulp-csso");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");

// Плагины для JavaScript
const webpack = require("webpack-stream");
const babel = require("gulp-babel");

// Плагины для изображений
const imagemin = require("gulp-imagemin");

// Плагины для сервера и управления файлами
const server = require("gulp-server-livereload");
const changed = require("gulp-changed");
const clean = require("gulp-clean");
const fs = require("fs");

// Плагины для обработки ошибок
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

// Плагины для шрифтов
const ttf2woff2 = require("gulp-ttf2woff2");
const { createFontStyles } = require("./functions/fonts");

//

//

// Конфиги
const fileincludeSettings = { prefix: "@@", basepath: "@file" };
const startServerSettings = { livereload: true, open: true };
const plumberNotify = (title) => ({
   errorHandler: notify.onError({ title, message: "Error <%= error.message %>", sound: false }),
});

//

//

// Обработка HTML файлов
gulp.task("html:prod", function () {
   return gulp
      .src(["./source/html/**/*.html", "!./source/html/components/*.html"])
      .pipe(changed("./production/"))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(fileinclude(fileincludeSettings))
      .pipe(htmlclean())
      .pipe(gulp.dest("./production/"));
});

// Компиляция SCSS в CSS
gulp.task("sass:prod", function () {
   return gulp
      .src("./source/scss/*.scss")
      .pipe(changed("./production/css"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true }))
      .pipe(groupCSSMediaQueries())
      .pipe(csso())
      .pipe(gulp.dest("./production/css"));
});

// Обработка JavaScript файлов
gulp.task("js:prod", function () {
   return gulp
      .src("./source/js/*.js")
      .pipe(changed("./production/js"))
      .pipe(plumber(plumberNotify("JS")))
      .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./production/js"));
});

// Копирование изображений
gulp.task("images:prod", function () {
   return gulp
      .src("./source/images/**/*")
      .pipe(changed("./production/images"))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./production/images"));
});

// Конвертирование шрифтов
gulp.task("fonts:prod", function () {
   // Таск для конвертации шрифтов в woff2
   const productionFontsDir = "./production/fonts";
   if (!fs.existsSync(productionFontsDir)) {
      fs.mkdirSync(productionFontsDir, { recursive: true });
   }

   return (
      gulp
         .src("./source/fonts/**/*")
         .pipe(ttf2woff2())
         .pipe(gulp.dest(productionFontsDir))
         // Таск для импорта woff2 в _fonts.scss
         .on("end", () => {
            createFontStyles(productionFontsDir, "./source/scss/modules/_fonts.scss");
         })
   );
});

// Запуск локального сервера после проверки
gulp.task("server:prod", function () {
   return gulp.src("./production/").pipe(server(startServerSettings));
});

// Очистка папки разработки
gulp.task("clean:prod", function (done) {
   if (fs.existsSync("./production/")) {
      return gulp.src("./production/", { read: false }).pipe(clean({ force: true }));
   }
   done();
});

// // Копирование других файлов
// gulp.task("files:prod", function () {
//    return gulp.src("./source/files/**/*").pipe(changed("./production/files")).pipe(gulp.dest("./production/files"));
// });
