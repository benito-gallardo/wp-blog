module.exports = {
  bundle: {
    main: {
      scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/hammerjs/hammer.js',
        './node_modules/jquery-hammerjs/jquery.hammer.js',
        './src/assets/js/global-admin/modernizr-custom.js', 
        './node_modules/vbox/js/bin/materialize.js'
      ]
    }
  }
};