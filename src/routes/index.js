
/*
 * GET home page.
 */

var rekuire = require('rekuire');
var clipping_tool = rekuire('clipping_tool');
var fs = require('fs');
var clipTool = new clipping_tool();

exports.index = function(req, res) {
    console.log('Router received a request for the Index page');
    
    var renderPage = (function(err, clippings) {
        console.log('Router started rendering the index page');
      	res.render('index');
    }).bind(this);

    clipTool.read('/media/dat/projets/ketl/tests/data/test-clippings.json', renderPage);
};

exports.uploadClippingFile = function(req, res) {
    // Render index page with result after the upload
    var renderPage = (function(err, clippings) {
        console.log('Router started rendering the index page');
        res.render('index');
    }).bind(this);

    // Write the file to the file system
    var writeClippingFile = (function(err, fileData) {
        var filePath = "/media/dat/projets/ketl/tests/data/test-upload-clippings.txt";
        console.log('Router started writing the clippings to file: %s', filePath);
        fs.writeFile(filePath, fileData, renderPage);
    }).bind(this);
    //
    // Read uploaded file
    console.log('Router has received a clipping file upload request.');
    fs.readFile(req.files.clippingFile.path, writeClippingFile);
};

exports.search = function(req, res) {
  // Extract parameters
  var searchCriteria = req.param('search-criteria') || '';
  var searchTarget = req.param('search-target') || '';
  console.log('Router received a search request for <%s> with criteria <%s>', searchCriteria, searchTarget);
  
  // Render the index page with results
  var renderPage = (function(err, result) {
      var clippingCount = 0;
      if (result) {
          clippingCount = result.length;
          console.log('Router started rendering the index page with %d clippings.', clippingCount);
          res.render('index', { 'clippings': result})
      } else {
          // A problem occured. Fallback
          console.error('Router was unabled to obtain clippings.');
          console.log('Router started rendering the index page with no clippings.');
          res.render('index');
      }
  }).bind(this);

  // Filter the raw clippings
  var filterClippings = (function(err, clippings) {
    clipTool.filterClippings(searchTarget, searchCriteria, clippings, renderPage);
  }).bind(this);
  //
  // Load clippings
  clipTool.read('/media/dat/projets/ketl/tests/data/test-clippings.json', filterClippings);
};