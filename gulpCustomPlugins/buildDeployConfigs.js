// gulp-util is used to created well-formed plugin errors
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var devConfig = require("../devconfig");


// The main function for the plugin – what the user calls – should return
// a stream.
var buildDeployConfig = function(configType) {
   configType = configType || 'package';
   return through.obj(function(file, encoding, callback) {
      var error = null;
      if (file.isBuffer()) {
         var baseConfig = _.get(devConfig, configType + 'Config', {});
         var config = _.defaults(devConfig.sharedConfig, baseConfig);
         var fileContents = new Buffer(JSON.stringify(config));
         file.contents = fileContents;
      } else {
         error = new gutil.PluginError('gulp-build-deploy-config', 'source file is not a buffer');
      }
      callback(error, file);
   });
};

// Export the plugin main function
module.exports = buildDeployConfig;