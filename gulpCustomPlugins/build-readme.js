// map-stream is used to create a stream that runs an async function
var map = require('map-stream');
// gulp-util is used to created well-formed plugin errors
var gutil = require('gulp-util');
var _ = require('lodash');
var through = require('through2');
var readmeBuilder = require('./readmeBuilder.js');

// The main function for the plugin – what the user calls – should return
// a stream.
var buildReadmePlugin = function() {
   return through.obj(function(file, encoding, callback) {
      var readmeString = readmeBuilder.compileToMdFormat();
      var error = null;
      if (!_.isString(readmeString)) {
         error = gutil.PluginError('gulp-buildReadme', 'readmeBuilder returned ' + readmeString);
      }
      var fileContents = new Buffer(readmeString);
      if (file.isBuffer()) {
         file.contents = fileContents;
      }
      callback(error, file);
   });
};

// Export the plugin main function
module.exports = buildReadmePlugin;