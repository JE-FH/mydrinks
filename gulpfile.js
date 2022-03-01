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



exports.default = exports.backend;