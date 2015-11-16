var webpack = require('webpack');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var plugins = [];

plugins.push(new UglifyJsPlugin({ minimize: true }));

module.exports = {
  cache : true,
  context: __dirname,
  entry: "./my_index.js",
  output: {
    filename: "calendar_out.js",
    path: __dirname,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
      loader: 'babel', // The module to load. "babel" is short for "babel-loader"
      include: "/home/ubuntu/countly_sidebar/frontend/express/public/javascripts/react/clear_test"
    }],
    noParse: [
      '/home/ubuntu/countly_sidebar/frontend/express/public/javascripts/react/rc-calendar'
    ]
  }/*,
  plugins: plugins*/
}
