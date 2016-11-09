#!/usr/bin/env node
var path = require("path");
var fs = require("fs");
var cp = require('child_process');

var projectName = process.argv[2];
if(!projectName){
  console.log('Error: Lack of parameter. Project name is required.');
  return false;
}

var currentPath = process.cwd();
var projectPath=path.join(currentPath, projectName);

if(fs.existsSync(projectPath)){
  console.log('Error: \''+projectName+'\' has been already existed, please do not init again.');
  return false;
}
//Create src directory
fs.mkdirSync(projectPath, 511);
fs.mkdirSync(path.join(projectPath,'/src'), 511);
fs.mkdirSync(path.join(projectPath,'/src/js'));
fs.mkdirSync(path.join(projectPath,'/src/css'));

console.log('Creating package.json...');
var packageJson = {
  name: projectName,
  version: '1.0.0',
  scripts: {
    test: 'echo \"Error: no test specified\" && exit 1',
    start: 'webpack-dev-server --hot --inline --progress --colors',
    build: 'webpack --progress --colors'
  },
  devDependencies: {
    "babel-core": "^6.18.2",
    "babel-loader": "^6.2.7",
    "babel-preset-es2015": "^6.18.0",
    "babel-preset-react": "^6.16.0",
    "babel-preset-stage-0": "^6.16.0",
    "css-loader": "^0.25.0",
    "style-loader": "^0.13.1",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  },
  dependencies: {
    "react": "^15.3.2",
    "react-dom": "^15.3.2"
  }
};
fs.writeFileSync(projectPath+'/package.json', JSON.stringify(packageJson, null, 4),{encoding:'utf-8'});

console.log("Creating webpack.config.js...");
var defaultImport = "var debug = process.env.NODE_ENV !== \"production\";\n"
+"var webpack = require(\'webpack\');\n\n"
+"module.exports = "

var webpackConfig = "var webpack = require('webpack');\n"
+"module.exports = {\n"
+"  entry: {\n"
+"    app: './src/js/app.js',\n"
+"  },\n"
+"  output: {\n"
+"    path: './build',\n"
+"    filename: '[name].js'\n"
+"  },\n"
+"  module: {\n"
+"    loaders: [\n"
+"      { test: /\.css$/, loader: 'style!css' },\n"
+"      {\n"
+"        test: /\.js$/,\n"
+"        exclude: /node_modules/,\n"
+"        loader: 'babel',\n"
+"        query:\n"
+"        {\n"
+"          presets:['es2015','stage-0','react']\n"
+"        }\n"
+"      }\n"
+"    ]\n"
+"  },\n"
+"  resolve:{\n"
+"      extensions:['','.js','.json']\n"
+"  },\n"
+"  plugins: [\n"
+"    new webpack.NoErrorsPlugin()\n"
+"  ]\n"
+"};\n";
fs.writeFileSync(projectPath+'/webpack.config.js',webpackConfig,{encoding:'utf-8'});

// Create index.html
console.log('Creating index.html...');
var html = '<!DOCTYPE html>\n'
+'<html>\n'
+'<head>\n'
+'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'
+'<title>React App</title>\n'
+'</head>\n'
+'<body>\n'
+'  <div id="root"></div>\n'
+'  <script src="app.js"></script>\n'
+'</body>\n'
+'</html>\n'

fs.writeFileSync(projectPath+'/index.html',html,{encoding:'utf-8'});

// Create client.js
console.log('Creating app.js...');
var appjs = "import React from 'react';\n"
+"import ReactDOM from 'react-dom';\n"
+"import '../css/app.css';\n\n"
+"ReactDOM.render(\n"
+"  <div>Hello, world</div>, \n"
+"  document.getElementById('root')\n"
+");\n";
fs.writeFileSync(projectPath+'/src/js/app.js',appjs,{encoding:'utf-8'});

console.log('Creating app.css...');
fs.writeFileSync(projectPath+'/src/css/app.css','',{encoding:'utf-8'});

console.log(projectName + ' init succeeded.');
console.log('\nYou can do following steps:');
console.log('    1.   cd ./'+projectName);
console.log('    2.   npm install');
console.log('    3.   npm start');

// console.log('npm install packages...');
// cp.exec('npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0 css-loader style-loader webpack webpack-dev-server');
// cp.exec('npm install --save react react-dom');
