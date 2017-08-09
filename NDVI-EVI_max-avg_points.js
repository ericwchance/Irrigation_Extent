//___________Eric Chance__Virginia Tech____2017

//Can change NDVI and EVI out as well as exchange means for maxes.

var L5_32_NDVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_NDVI"),
    L5_32_EVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_EVI"),
    fc = ee.FeatureCollection("ft:1uCCauJs8vvrnHcWBVxKIRf1VpBsBGPl8UeQmlgzd");

//pull data for each growing season
var ls01 = ee.ImageCollection(L5_32_NDVI).filterDate('2002-04-01', '2002-10-31');
var ls02 = ee.ImageCollection(L5_32_NDVI).filterDate('2007-04-01', '2007-10-31');


//take growing season maxs to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the 32 day composites but there are
var max01 = ls01.mean();
var max02 = ls02.mean();


//Do it by adding bands-output doesnt say years but they are in order 1984-2011
var max_pile = max01.addBands([max02]);
Map.addLayer(max_pile);


//pull data at the sample points
var points = max_pile.sampleRegions(fc, null, 30, "EPSG:32611");
Export.table.toDrive(points);

// Print and display the FeatureCollection points.
print(fc)
Map.addLayer(fc, {color: 'FF0000'}, 'From Fusion Table');
