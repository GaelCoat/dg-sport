// var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {

  var version = Date.now();

  // Configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // On copie tous les fichiers dans public
    copy: {
      css: {
        files: [
          {
            cwd: 'dist/',
            src: ['**/*'],
            dest: 'compiled/',
            expand: true,
            flatten: false
          },
        ]
      }
    },

    pug: {
      compile: {
        cwd: 'views/',
        src: ['*.pug'],
        dest: 'compiled/',
        ext: '.html',
        expand: true,
      }
    },

    // On minifie les CSS
    cssmin: {
      modules: {
        cwd: 'compiled/css/',
        src: ['*.css'],
        dest: 'compiled/css/',
        expand: true,
      }
    }

  });

  // Chargement des modules
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.registerTask('default', [
    'copy',
    'pug',
    'cssmin',
  ]);

};
