module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            options: {
                separator: '\n\n//---------------------------------------\n',
                banner: '//---------------------------------------\n'
            },
            dist: {
                src: ['components/js/*.js'],
                dest: 'build/development/js/scripts.js'
            }
        }, //concat
        
        bower_concat: {
            all: {
                dest: 'build/development/js/_bower.js',
                cssDest: 'build/development/css/_bower.css'
            }
        }, //bower_concat
        
        sass: {
            dist: {
                options: {
                    outputStyle: 'nested'
                },
                files: [{
                    src: 'components/sass/style.scss',
                    dest: 'build/development/css/style.css'
                }]
            }
        }, //sass
        
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3000,
                    base: 'build/development',
                    livereload: true
                }
            }
        }, //connect
        
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            scripts: {
                files: [
                    'build/development/**/*.html',
                    'components/scripts/**/*.js',
                    'components/sass/**/*.scss'
                ],
                tasks: ['concat', 'sass']
            }
        } //watch
    });
    
    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['connect', 'bower_concat', 'concat', 'sass', 'watch']);
};