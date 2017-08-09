//___________Eric Chance and Blaine Dawson__Virginia Tech and Boise State____2017

filename = 'C:\WHATEVER\somefile.xlsx';


[num, txt, raw] = xlsread(filename,'B28:B1828');
[num1, txt1, raw1] = xlsread(filename,'D72:D1828');

%B,D for EVI avg; H,J for ndmi avg; N,P for ndmi max h1749, j1767
%[num, txt, raw] = xlsread(filename,'B2:B204');
%[num1, txt1, raw1] = xlsread(filename,'D2:D202');

%[num, txt, raw] = xlsread(filename,'B2:B3000');
%[num1, txt1, raw1] = xlsread(filename,'D2:D3000');

%[num, txt, raw] = xlsread(filename,'B2:B162');
%[num1, txt1, raw1] = xlsread(filename,'D2:D136');
%[num, txt, raw] = xlsread(filename,'I2:I162');
%[num1, txt1, raw1] = xlsread(filename,'K2:K136');


%[num, txt, raw] = xlsread(filename,'N2:N210');
%[num1, txt1, raw1] = xlsread(filename,'P2:P211');
%t,v for NDMI max 9x9
%[num, txt, raw] = xlsread(filename,'T2:T1776');
%[num1, txt1, raw1] = xlsread(filename,'V2:V1747');
%[num, txt, raw] = xlsread(filename,'T2:T211');
%[num1, txt1, raw1] = xlsread(filename,'V2:V211');


area_irr = num;
area_rf = num1; 
area_total= [num; num1];

[f,xi] = ksdensity(area_irr);                                           %determines ksdensity pdf of irrigated area data
[f1,xi1] = ksdensity(area_rf);                                          %determines ksdensity pdf of non-irrigated area data

figure
plot(xi,f,xi1,f1);

%figure
%histfit([num,num1],1,'kernel');


        varyThresh = 1:1:ceil(max(xi));                                         %vector of area values to cycle through to find best threshold
        locator = zeros(1,length(varyThresh));                                  %preallocates for speed

        for m = 1:length(varyThresh)                                            %cycles through each threshold value and calculates probability of selecting either irrigated or non-irrigated
            IrrI = find(xi>=varyThresh(m));                                     %finds locations in vector where irrigated area is greater than varying threshold value
            probIrr = (sum(f(IrrI)))/(sum(f));                                  %finds probability of selecting an irrigated area from ksdensity data at given varying threshold
            RfI = find(xi1<varyThresh(m));                                      %finds locations in vector where non-irrigated area is less than varying threshold value
            probRf = (sum(f1(RfI)))/(sum(f1));                                  %finds probability of selecting a non-irrigated area from ksdensity data at given varying threshold
            locator(m) = abs(probIrr-probRf);                                   %creates vectors of differences in probabilities
        end

        locMin = min(locator);                                                  %finds location where differences in probability is minimal
        locI = find(locMin == locator);                                         %finds index location where sign of differences switches
        bestThreshold = varyThresh(locI);                                       %applies actual threshold value to vector location of minimum
        numThresh = numel(bestThreshold);                                       %counts number of locations where minimum existed
        if numThresh >1                                                         %check to make sure we only apply one location and threshold value
            classThreshold = mean(bestThreshold);                               %if minimum occurs twice, take the average as best threshold value
        else
            classThreshold = bestThreshold;                                     %otherwise, accept threshold value
        end
      
