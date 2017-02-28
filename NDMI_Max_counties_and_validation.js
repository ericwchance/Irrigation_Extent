// Load a Fusion Table from the ID using the FeatureCollection constructor.
//var fc = ee.FeatureCollection('ft:1vduVGOs9LB6TnXDC-nuNyOxtTbSl0W2nEca83iSq');

//Manually set the threshold:
var threshold= 0.338541667;
//var threshold= 0.331770833;



//pull up landsat 5 collection
var collection = ee.ImageCollection('LANDSAT/LT5_SR')
  .set('SENSOR_ID', 'TM');
//  .filterDate('1984-01-01', '1984-12-31')
//  .filterBounds(ee.Geometry.Rectangle(-111.12073045, 42.00940876, -114.96933917, 44.53879937));

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
//var ndwi_base = collection2.select(['nd']);


// Create a greenest pixel composite.
//var greenestpc = collection4.qualityMosaic('nd');
//var greenestpc2 = collection2.qualityMosaic('nd');

//remove other bands
//var ndwi = greenestpc.select(['nd']);
//var ndwi_all= collection4.select('nd');

//var gs= ndwi_base.filterDate('1984-04-01', '1984-11-01');
//var ndwi_gs_mean= gs.reduce(ee.Reducer.mean());


//pull data for each growing season
var ls01 = ndwi_base.filterDate('2007-04-01', '2007-10-31');

//take growing season maxs to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the 32 day composites but there are
var max01 = ls01.max();

//Do it by adding bands-output doesnt say years but they are in order 1984-2011
var max_pile = max01
//.addBands([max02, max03, max04, max05, max06, max07, max08, max09, max10, max11, max12, max13, max14, max15, max16, max17, max18, max19, max20, max21, max22, max23, max24, max25, max26, max27, max28]);
Map.addLayer(max_pile, {palette: '000000, FFFFFF', min: -.8, max: .8}, 'NDMMI');


// Create Classified image 1 for irr 0 for non
var classified = max_pile.expression("(b('nd') > t) ? 1" + ": 0",  {'t': (threshold)});
Map.addLayer(classified, {palette: 'FFFFFF, 000000', min: 0, max: 1}, 'classified');


// Add reducer output to the Features in the collection.
var class_count = classified.reduceRegions({
  collection: fc,
  reducer: ee.Reducer.sum(),
  scale: 30,
  crs:  "EPSG:32611"
});


//pull data at the sample points
//var points = max_pile.sampleRegions(fc, null, 30, "EPSG:32611");
//Export.table.toDrive(points);
Export.table.toDrive(class_count);

// Print and display the FeatureCollection points.
//print(fc)
//print(class_count)
//print(ee.Feature(class_count.first()));
Map.addLayer(fc, {color: 'FF0000'}, 'From Fusion Table');

//print('Projection, crs, and crs_transform:', collection.projection());
//print('Scale in meters:', collection.projection().nominalScale());
    

// Load a Fusion Table from the ID using the FeatureCollection constructor.
var vp = ee.FeatureCollection('ft:1HT2aMT62L_xHL6xBouK_GvtZ83ZNZsld_VvqyRUf');


//pull data at the validation points
//var vali_points = classified.sampleRegions(vp, null, 30, "EPSG:32611");
var vali_points = classified.sampleRegions(vp, null, 30, "EPSG:4326");
Export.table.toDrive(vali_points,"validation_points");

//classified_and masked display
var cm = ee.Image(0).where(
        classified.select('constant').gte(1),
        1
)
Map.addLayer(cm.mask(cm),{palette:'369b47'},'classified_and_masked');
Map.addLayer(vp, {color: '0000FF'}, 'Validation Points');

//load up, map and export data for second set of validation points
var vp2 = ee.FeatureCollection('ft:1F3gk9c1_PzOIfULBHvmv_joaCGGiB6rrE18EaSYy');
var vali_points_b = classified.sampleRegions(vp2, null, 30, "EPSG:4326");
Export.table.toDrive(vali_points_b,"validation_points_b");
Map.addLayer(vp2, {color: 'FF00FF'}, 'Validation Points2');
