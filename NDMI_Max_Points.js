var L5_32_EVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_EVI"),
    fc = ee.FeatureCollection("ft:1uCCauJs8vvrnHcWBVxKIRf1VpBsBGPl8UeQmlgzd");

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

//remove other bands
var ndwi_base = collection4.select(['nd']);

//pull data for each growing season
var ls01 = ndwi_base.filterDate('1984-04-01', '1984-10-31');

//take growing season maxs to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the 32 day composites but there are
var max01 = ls01.max();

//pull data at the sample points
var points = max01.sampleRegions(fc, null, 30, "EPSG:32611");
Export.table.toDrive(points);

// Print and display the FeatureCollection points.
print(fc)
Map.addLayer(fc, {color: 'FF0000'}, 'From Fusion Table');
