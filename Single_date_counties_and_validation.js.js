var fc = ee.FeatureCollection("ft:1vduVGOs9LB6TnXDC-nuNyOxtTbSl0W2nEca83iSq"),
    L5EVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_EVI"),
    L5NDVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_NDVI"),
    L5NDMI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_NDWI");

//////////////////
//
//Change the threshold (Line 14), year&month (Line 21),
//feature collection you are using (line 18), and band (line 18 and 37)
//////////////////

Map.addLayer(fc, {color: 'FF0000'}, 'From Fusion Table');
//Manually set the threshold:
var threshold= 0.026041667;


//remove all bands except evi
//var evi = L5EVI.select(['EVI']);

//pull data for each growing season
var ls01 = L5NDMI.filterDate('2007-06-01', '2007-06-30');


//take growing season means to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the composites but there are for landsat so keeping it consistant here
var mean01 = ls01.max();


//Do it by adding bands- the output table doesnt lable the columns as years but they are in order 2000-2015
var mean_pile = mean01
Map.addLayer(mean_pile);


// Create Classified image 1 for irr 0 for non
var classified = mean_pile.expression("(b('EVI') > t) ? 1" + ": 0",  {'t': (threshold)});
Map.addLayer(classified, {palette: 'FFFFFF, 369b47', min: 0, max: 1}, 'classified');


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
Map.addLayer(vp, {color: '00FF00'}, 'Validation Points');
//pull data at the validation points
//var vali_points = classified.sampleRegions(vp, null, 30, "EPSG:32611");
var vali_points = classified.sampleRegions(vp, null, 30, "EPSG:4326");
Export.table.toDrive(vali_points,"validation_points");

//load up, map and export data for second set of validation points
var vp2 = ee.FeatureCollection('ft:1F3gk9c1_PzOIfULBHvmv_joaCGGiB6rrE18EaSYy');
var vali_points_b = classified.sampleRegions(vp2, null, 30, "EPSG:4326");
Export.table.toDrive(vali_points_b,"validation_points_b");
Map.addLayer(vp2, {color: 'FF00FF'}, 'Validation Points2');
