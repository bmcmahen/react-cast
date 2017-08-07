var path = require('path')

module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'src/__tests__/*.js'
    ],
    preprocessors: {
      'src/__tests__/*.js': [ 'webpack', 'sourcemap']
    },
    reporters: [ 'mocha' ],
    browsers: ['Chrome'],
    logLevel: config.LOG_ERROR,
    client: {
      captureConsole: true
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel'
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    autoWatch: true
  });
};
