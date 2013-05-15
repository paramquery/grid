module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('pqgrid.jquery.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + '*/\n',
        jsbeautifier: {
            files: ['gruntfile.js', '<%= pkg.name %>.dev.js', 'test/**/*.js']
        },
        jshint: {
            files: ['gruntfile.js', '<%= pkg.name %>.dev.js', 'test/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: false, // suppress outer closure warning
                latedef: true,
                newcap: false,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                browser: true,
                jquery: true,
                smarttabs: true,
                strict: false,
                multistr: true,
                devel: true, // TODO: make this false before pushing to prod!
                globals: {
                    exports: true,
                    Globalize: true
                }
            }
        },
        csslint: {
            all: {
                src: ['<%= pkg.name %>.dev.css'],
                rules: {
                    'adjoining-classes': false,
                    'floats': false,
                    'important': false,
                    'duplicate-background-images': false,
                    'box-model': false,
                    'font-faces': false,
                    'font-sizes': false,
                    'box-sizing': false,
                    'zero-units': false,
                    'outline-none': false
                }
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        cssmin: {
            all: {
                src: ['<%= pkg.name %>.dev.css'],
                dest: '<%= pkg.name %>.min.css'
            }
        },
        min: {
            js: {
                src: ['<%= pkg.name %>.dev.js'],
                dest: '<%= pkg.name %>.min.js'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    // JS Beautify.
    grunt.registerTask('beautify', ['jsbeautifier']);
    // Production task.
    grunt.registerTask('prod', ['jshint', 'csslint', 'qunit', 'cssmin', 'min']);
    // Dev mode: no minifying.
    grunt.registerTask('default', ['jshint', 'beautify', 'csslint']);
};
