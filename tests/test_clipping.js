
var ClippingTests = function() {

}

var testImport = function() {
	var ct = new ClipTool();
	var src = '/media/dat/projets/ketl/tests/data/test-clippings.txt';
	var des = '/media/dat/projets/ketl/tests/data/test-clippings.json';
	ct.import(src, des);
}

var testRead = function() {
	var ct = new ClipTool();
	ct.loadFromFile(src, des);
}