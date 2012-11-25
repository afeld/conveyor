/*jshint node:true */
/*global module:false*/
'use strict';

module.exports = function(grunt) {
  var defaults = 'lint mocha mochaTest';

  // set up test server
  require('./test/server.js');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        boss: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true
      }
    },
    lint: {
      files: ['*.js', 'lib/**/*.js', 'test/*.js']
    },
    mocha: {
      index: ['test/index.html']
    },
    mochaTest: {
      files: ['test/server_test.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: defaults
    }
  });

  // default tasks
  grunt.registerTask('default', defaults);

  // client tests
  grunt.loadNpmTasks('grunt-mocha');
  // server tests
  grunt.loadNpmTasks('grunt-mocha-test');
};
