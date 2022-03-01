const { series, parallel, src, dest, watch } = require("gulp"); 
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

const backendTsProject = ts.createProject("server/tsconfig.json");

exports.backend = function backend() {
	return backendTsProject.src()
		.pipe(sourcemaps.init({}))
		.pipe(backendTsProject())
		.pipe(sourcemaps.mapSources((sourcePath, file) => {
			return "../" + sourcePath;
		}))
		.pipe(sourcemaps.write())
		.pipe(dest(backendTsProject.options.outDir))
}

exports.copy_views = function copy_views() {
	return src(["./frontend/views/*.ejs", "./frontend/views/**/*.ejs"])
		.pipe(dest("./build/views/"))
}
exports.frontend = parallel(this.copy_views)

exports.frontend_backend = parallel(exports.backend, exports.frontend)

exports.default = exports.frontend_backend;