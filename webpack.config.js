"use strict";
var path = require("path");
var webpack = require("webpack");

var options = {

  entry: {
    // Le coeur de l'application
    app: ["./src/main.js"],
    // Les librairies externes
    vendor: [
      "underscore",
      "jquery",
      "backbone",
      "backbone.marionette",
      "q",
    ]
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/dist/",
  },

  resolve: {
    extensions: [
      "",
      ".js",
      ".json",
    ],
    modulesDirectories: ["./src", "./src/js/libs", "node_modules"]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["eslint-loader"],
      },

      {
        include: /\.pug/,
        loader: 'pug-html-loader'
      },

    ],
  },

  plugins: (
    [
      new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
      // On expose des proxy pour les dépendances des librairies
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "root.jQuery": "jquery",
        _: 'underscore',
        q: 'q',
        Backbone: 'backbone',
        Marionette: 'backbone.marionette',
      }),
    ]
  ),

}

module.exports = options;
