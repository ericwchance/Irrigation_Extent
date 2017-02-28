# Irrigation_Extent
Testing NDMI, NDVI and EVI, seasonal max, average, and single date methods for differentiating irrigated v. non irrigated lands, Snake river Plain Idaho.

A single threshold for each spectral index/aggrigation method/sensor/year combination is used. Most of the code is in Google Earth Engine, except for the matlab code used for determining each threshold (based on exported data from GEE). That threshold is then plugged back in (manually) to GEE, to map irrigated and non irrigated lands.

Things that need to be changed manually in the codes:

The year

The threshold

Maxes and averages use the same code, just change every max to avg

In the matlab code, the input filename and cell ranges need to be changed. 
