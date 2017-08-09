//___________Eric Chance__Virginia Tech____2017

var L5_32_EVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_EVI"),
    fc = ee.FeatureCollection("ft:1uCCauJs8vvrnHcWBVxKIRf1VpBsBGPl8UeQmlgzd");
    
var fcc = ee.FeatureCollection('ft:1vduVGOs9LB6TnXDC-nuNyOxtTbSl0W2nEca83iSq');
var collection = ee.ImageCollection('LANDSAT/LT5_SR')
  .set('SENSOR_ID', 'TM');

//add ndwi
var addNDWI = function(image) {
  return image.addBands(image.normalizedDifference(['B4', 'B5']));
};
var collection2=collection.map(addNDWI);

//mask clouds and stuff
var maskClouds = function(image) {
  return image.updateMask(image.select(['cfmask']).lt(0.9));
};
var collection4=collection2.map(maskClouds);

// Create a base greenest pixel composite for whole year.
//var greenestpca = collection4.qualityMosaic('nd');
//var greenestpc2 = collection2.qualityMosaic('nd');

//remove other bands
var ndwi_base = collection4.select(['nd']);

//pull data for each growing season
var ls01 = ndwi_base.filterDate('2002-04-01', '2002-10-31');


//take growing season maxs to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the 32 day composites but there are
var max01 = ls01.max();

//9cell square trans
var trans1 = max01.translate(-30, -30);
var trans2 = max01.translate(-30, 0);
var trans3 = max01.translate(-30, 30);
var trans4 = max01.translate(0, -30);
var trans5 = max01.translate(0, 30);
var trans6 = max01.translate(30, -30);
var trans7 = max01.translate(30, 0);
var trans8 = max01.translate(30, 30);

//Do it by adding bands-output doesnt say years but they are in order 1984-2011
var max_pile = max01.addBands([trans1, trans2, trans3, trans4 ,trans5, trans6, trans7, trans8]);
Map.addLayer(max_pile);
Map.addLayer(max01, {palette: '000000, FFFFFF', min: -.4, max: .75}, 'NDMMI');

//pull data at the sample points
var points = max_pile.sampleRegions(fc, null, 30, "EPSG:32611");
Export.table.toDrive(points);

Map.addLayer(fcc, {color: 'FF0000'}, 'masked counties');

// Print and display the FeatureCollection points.
print(fc)
Map.addLayer(fc, {color: '000FF0'}, 'control points');

