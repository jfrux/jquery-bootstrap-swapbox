module.exports = function(grunt) {

	grunt.initConfig({
		// Import package manifest
		pkg: grunt.file.readJSON("bootstrap-swapbox.jquery.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			demo: {
				src: ["src/demo/js/bootstrap.js"],
				dest: "demo/demo.js"
			},
			dist: {
				src: ["src/jquery.bootstrap-swapbox.js"],
				dest: "dist/jquery.bootstrap-swapbox.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.bootstrap-swapbox.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},
    less: {
      dist: {
        files: {
          "demo/demo.css": [
            "src/demo/less/demo.less"
          ]
        },
        options: {
          compress: true
        }
      }
    },

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.bootstrap-swapbox.js"],
				dest: "dist/jquery.bootstrap-swapbox.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},
		// watch
		watch: {
			coffee: {
				files: ["src/jquery.bootstrap-swapbox.coffee"],
        tasks: ["coffee", "jshint", "concat", "uglify"]
      },
      less: {
				files: ["src/demo/less/*.less","src/demo/less/bootstrap/*.less"],
        tasks: ["less"]
      }
		},
		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"src/jquery.bootstrap-swapbox.js": "src/jquery.bootstrap-swapbox.coffee"
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["coffee", "jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);
};
