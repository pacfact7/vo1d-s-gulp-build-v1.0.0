const gulp = require("gulp"),
   fileinclude = require("gulp-file-include");

// Плагины для CSS
const sass = require("gulp-sass")(require("sass")),
   sassGlob = require("gulp-sass-glob"),
   sourceMaps = require("gulp-sourcemaps");

// Плагины для JavaScript
const webpack = require("webpack-stream");

// Плагины для сервера и управления файлами
const changed = require("gulp-changed"),
   server = require("gulp-server-livereload"),
   clean = require("gulp-clean"),
   fs = require("fs");

// Плагины для обработки ошибок
const plumber = require("gulp-plumber"),
   notify = require("gulp-notify");

// Плагины для шрифтов
const ttf2woff2 = require("gulp-ttf2woff2"),
   { createFontStyles } = require("./functions/fonts");

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
gulp.task("html:dev", function () {
   return gulp
      .src(["./source/html/**/*.html", "!./source/html/components/*.html"])
      .pipe(changed("./development/", { hasChanged: changed.compareContents }))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(fileinclude(fileincludeSettings))
      .pipe(gulp.dest("./development/"));
});

// Компиляция SCSS в CSS
gulp.task("sass:dev", function () {
   return gulp
      .src("./source/scss/*.scss")
      .pipe(changed("./development/css"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./development/css"));
});

// Обработка JavaScript файлов
gulp.task("js:dev", function () {
   return gulp
      .src("./source/js/*.js")
      .pipe(changed("./development/js"))
      .pipe(plumber(plumberNotify("JS")))
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./development/js"));
});

// Копирование изображений
gulp.task("images:dev", function () {
   return gulp
      .src("./source/images/**/*")
      .pipe(changed("./development/images"))
      .pipe(gulp.dest("./development/images"));
});

// Конвертирование шрифтов
gulp.task("fonts:dev", function () {
   // Таск для конвертации шрифтов в woff2
   const developmentFontsDir = "./development/fonts";
   if (!fs.existsSync(developmentFontsDir)) {
      fs.mkdirSync(developmentFontsDir, { recursive: true });
   }

   return (
      gulp
         .src("./source/fonts/**/*")
         .pipe(ttf2woff2())
         .pipe(gulp.dest(developmentFontsDir))
         // Таск для импорта woff2 в _fonts.scss
         .on("end", () => {
            createFontStyles(developmentFontsDir, "./source/scss/modules/_fonts.scss");
         })
   );
});

// Запуск локального сервера для разработки
gulp.task("server:dev", function () {
   return gulp.src("./development/").pipe(server(startServerSettings));
});

// Очистка папки разработки
gulp.task("clean:dev", function (done) {
   if (fs.existsSync("./development/")) {
      return gulp.src("./development/", { read: false }).pipe(clean({ force: true })); // Удаляем папку разработки
   }
   done();
});

// Наблюдение за изменениями в режиме разработки
gulp.task("watch:dev", function () {
   gulp.watch("./source/scss/**/*.scss", { usePolling: true }, gulp.parallel("sass:dev"));
   gulp.watch("./source/**/*.html", { usePolling: true }, gulp.parallel("html:dev"));
   gulp.watch("./source/images/**/*", { usePolling: true }, gulp.parallel("images:dev"));
   gulp.watch("./source/fonts/**/*", { usePolling: true }, gulp.parallel("fonts:dev"));
   gulp.watch("./source/js/**/*.js", { usePolling: true }, gulp.parallel("js:dev"));
   // gulp.watch("./source/files/**/*", { usePolling: true }, gulp.parallel("files:dev"));
});

// // Копирование других файлов
// gulp.task("files:dev", function () {
//    return gulp
//       .src("./source/files/**/*")
//       .pipe(changed("./development/files"))
//       .pipe(gulp.dest("./development/files"));
// });
