// gulp-util is used to created well-formed plugin errors
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');

var replaceStrings = {
   'lodash': '_.',
   'get-collection-helpers': 'helpers.'
};
var DISCLAIMER = '/**\n' +
   ' * This unit test file was auto generated via a gulp task.\n' +
   ' * Any formatting issues can be ignored\n' +
   ' */\n\n';

// The main function for the plugin – what the user calls – should return
// a stream.
var buildUnitTests = function(type, helpersRequireSource, wrapperTestDescription) {
   return through.obj(function(file, encoding, callback) {
      fs.readFile('./src/lodash-collection-helpers-spec.js', function(err, data) {
         if (err) {
            var fsReadError = new gutil.PluginError('gulp-buildUnitTests', 'fs.readFile returned ' + err);
            return callback(fsReadError, file);
         }

         var error = null;
         if (file.isBuffer()) {
            var generatedFileCode;
            var generatedTests;
            var tests = data.toString().split('/* Main Unit Tests */');
            if (helpersRequireSource) {
               var imports = tests[0].replace('./lodash-collection-helpers', helpersRequireSource);
               generatedTests = tests[1];
               if (wrapperTestDescription) {
                  generatedTests = 'describe("' + wrapperTestDescription + '", function() {\n' + tests[1] + '\n});\n';
               }
               generatedFileCode = imports + generatedTests;
            } else {
               var mainUnitTests = tests[1];
               generatedTests = mainUnitTests.replace(/lodashCollectionHelpers./g, replaceStrings[type]);
               var fileCode = file.contents.toString();
               generatedFileCode = fileCode.replace('/*code*/', generatedTests);
            }
            var fileContents = new Buffer(DISCLAIMER + generatedFileCode);
            file.contents = fileContents;
         } else {
            error = new gutil.PluginError('gulp-buildUnitTests', 'source file is not a buffer');
         }
         callback(error, file);
      });
   });
};

// Export the plugin main function
module.exports = buildUnitTests;