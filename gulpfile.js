const gulp = require("gulp");
require("./gulp_modes/dev.js");
require("./gulp_modes/prod.js");

//

//

// Режим по умолчанию для разработки
gulp.task(
   "default",
   gulp.series(
      "clean:dev", // Очистка директории dev
      gulp.parallel("html:dev", "sass:dev", "images:dev", "fonts:dev", "js:dev"),
      gulp.parallel("server:dev", "watch:dev")
   )
);

// Режим для продакшен сборки
gulp.task(
   "prod",
   gulp.series(
      "clean:prod", // Очистка директории prod
      gulp.parallel("html:prod", "sass:prod", "images:prod", "fonts:prod", "js:prod"),
      gulp.parallel("server:prod")
   )
);