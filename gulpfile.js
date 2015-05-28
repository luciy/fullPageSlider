var gulp        = require('gulp'),
    del         = require('del'),
    header      = require('gulp-header'),
    sass        = require('gulp-ruby-sass'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    watch       = require('gulp-watch'),
    gulpif      = require('gulp-if'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var pkg = require('./package.json');
var banner = ['/*!',
    ' * copyright (c) 2014-2015, <%= pkg.name %> v<%= pkg.version %>',
    ' * description: <%= pkg.description %>',
    ' * build time: <%= new Date() %>',
    ' */',
    ''].join('\n');


// ==========================================
//  路径配置参数
// ==========================================
var paths = {
    sourceSassPath: 'assets/sass/**/*.scss',            //sass源路径
    outputCssPath: 'assets/css/',                       //生成路径
    cssSourcemapsPath: '../maps/',                      //sourcemaps路径

    sourceJsListPath: [                                 //js源路径列表
        'assets/js/loading.js',
        'assets/js/copyright.js',
        'assets/js/app.js'
    ],
    outputJsPath: 'assets/js/',                         //js生成路径

    outputImagePath: 'assets/images/',                  //图片压缩后路径

    distCssPath: 'dist/assets/css/',                    //发布项目路径
    distJsPath: 'dist/assets/js/',
    distImagePath: 'dist/assets/images/'
}


// ===============================================
//  启动服务   API:http://www.browsersync.io/docs/options/
// ===============================================
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./",                          // 配置目录
            directory: true                         // 是否显示文件目录
        },
        open: 'external'                            // 此配置 按照本地IP打开(需要连网)
    });
});
// 任务：刷新浏览器
gulp.task('bs-reload', function () {
    browserSync.reload();
});




// ===============================================
//  sass
// ===============================================
gulp.task('sass',function(e){
    return gulp.src(paths.sourceSassPath)
        .pipe(sass({
            'sourcemap=none': false,                      // 开启sourcemap 'sourcemap=none': false|true 
            sourcemapPath: paths.cssSourcemapsPath,       // 配置sourcemap路径
            style:"compressed"                            // 输出css格式
        }))
        // .pipe(rename({suffix: '.min'}))
        .on('error', function (err) {                     // 错误打印错误代码
            console.log(err.message);
        })
        .pipe(header(banner,{pkg:pkg}))                   // 添加头部版权
        .pipe(gulp.dest(paths.outputCssPath))             // 生成到目标路径
        .pipe(reload({stream:true}))                      // 浏览器刷新配置
        // .pipe(notify({
        //     message: 'Style task complete!'            // 弹出提示框
        // }))
});




// ===============================================
//   js 合并
// ===============================================
gulp.task('jscombo', function() {
    return gulp.src(paths.sourceJsListPath)
        .pipe(concat('qingui.js'))
        .pipe(gulp.dest(paths.outputJsPath))
});
// js 压缩
gulp.task('jsmin', ['jscombo'], function() {
    return gulp.src(paths.outputJsPath+'qingui.js')
        .pipe(uglify({
            output: {
                ascii_only:true                             // 将中文转为unicode编码
            },
            compress: {
                drop_console:true                           // 扔掉console调试语句
            }
        }))
        .pipe(header(banner,{pkg:pkg}))                     // 添加头部版权
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.outputJsPath))
});


// 清除任务
gulp.task('clean',function(cb){
  del('./dist/*', cb);
});

// ===============================================
// 监听任务
// ===============================================
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(paths.sourceSassPath, ['sass']);
    gulp.watch("*.{html,htm}", ['bs-reload']);
    gulp.watch(paths.sourceJsListPath, ['bs-reload']);
});


// 监听任务
// ===============================================
gulp.task('default', ['clean','sass','jsmin'], function () {
    gulp.src(paths.outputCssPath+'**/*.css').pipe(gulp.dest(paths.distCssPath));
    gulp.src([paths.outputJsPath+'qingui.min.js',paths.outputJsPath+'qingui.js']).pipe(gulp.dest(paths.distJsPath));
    gulp.src(paths.outputImagePath+'**/*.{jpg,png,gif,webp,swf}').pipe(gulp.dest(paths.distImagePath));
    gulp.src('./*.{html,htm}').pipe(gulp.dest('./dist'));
});