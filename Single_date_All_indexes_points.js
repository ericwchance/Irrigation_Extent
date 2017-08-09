//___________Eric Chance__Virginia Tech____2017

/////////Currently set up to do EVI average for 2002 and 2007, but you can change it to NDVI or NDMI

var L5_32_NDVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_NDVI"),
    L5_32_EVI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_EVI"),
    L5_32_NDMI = ee.ImageCollection("LANDSAT/LT5_L1T_32DAY_NDWI"),
    fc = ee.FeatureCollection("ft:1uCCauJs8vvrnHcWBVxKIRf1VpBsBGPl8UeQmlgzd");

//pull data for each growing season
var ls01 = ee.ImageCollection(L5_32_EVI).filterDate('2002-04-01', '2002-04-30');
var ls02 = ee.ImageCollection(L5_32_EVI).filterDate('2002-05-01', '2002-05-30');
var ls03 = ee.ImageCollection(L5_32_EVI).filterDate('2002-06-01', '2002-06-30');
var ls04 = ee.ImageCollection(L5_32_EVI).filterDate('2002-07-01', '2002-07-30');
var ls05 = ee.ImageCollection(L5_32_EVI).filterDate('2002-08-01', '2002-08-30');
var ls06 = ee.ImageCollection(L5_32_EVI).filterDate('2002-09-01', '2002-09-30');
var ls07 = ee.ImageCollection(L5_32_EVI).filterDate('2002-10-01', '2002-10-30');

var als01 = ee.ImageCollection(L5_32_EVI).filterDate('2007-04-01', '2007-04-30');
var als02 = ee.ImageCollection(L5_32_EVI).filterDate('2007-05-01', '2007-05-30');
var als03 = ee.ImageCollection(L5_32_EVI).filterDate('2007-06-01', '2007-06-30');
var als04 = ee.ImageCollection(L5_32_EVI).filterDate('2007-07-01', '2007-07-30');
var als05 = ee.ImageCollection(L5_32_EVI).filterDate('2007-08-01', '2007-08-30');
var als06 = ee.ImageCollection(L5_32_EVI).filterDate('2007-09-01', '2007-09-30');
var als07 = ee.ImageCollection(L5_32_EVI).filterDate('2007-10-01', '2007-10-30');

//take growing season maxs to account for different #s of images 
//(seems to range from about 3 to 7)
//it seems like there shouldnt be differnt numbers of 
//images in the 32 day composites but there are
var mean01 = ls01.mean();
var mean02 = ls02.mean();
var mean03 = ls03.mean();
var mean04 = ls04.mean();
var mean05 = ls05.mean();
var mean06 = ls06.mean();
var mean07 = ls07.mean();
var mean08 = als01.mean();
var mean09 = als02.mean();
var mean10 = als03.mean();
var mean11 = als04.mean();
var mean12 = als05.mean();
var mean13 = als06.mean();
var mean14 = als07.mean();


//Do it by adding bands-output doesnt say years but they are in order 1984-2011
var max_pile = mean01.addBands([mean02,	mean03,	mean04,	mean05,	mean06,	mean07,	mean08,	mean09,	mean10,	mean11,	mean12,	mean13,	mean14]);
Map.addLayer(max_pile);


//pull data at the sample points
var points = max_pile.sampleRegions(fc, null, 30, "EPSG:4326");
Export.table.toDrive(points);

// Print and display the FeatureCollection points.
print(fc)
Map.addLayer(fc, {color: 'FF0000'}, 'From Fusion Table');

