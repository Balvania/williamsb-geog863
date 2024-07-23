
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], (Map, MapView, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) => {

  const map = new Map({
    basemap: "dark-gray-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 8,
    center: [-15.6, 28.28]
  });
  
  // *** Adding cities layer *** //
  const citySym = new SimpleMarkerSymbol({
    color: "yellow",
    style: "square",
    size: 12    
  });
  
  
  const cityRenderer = new SimpleRenderer({
    symbol: citySym  // uses a SimpleMarkerSymbol
  });
  
  const cityLyr = new FeatureLayer({
    portalItem: { 
      //id: "5af96a04ef4c4d8a9bb2a9dd2c883e36"
      //change to elephant layer
      id: "4e1b261719ca421b9555ee6eb99bab8c"
    },
    renderer: cityRenderer
  });

  
  
  
  map.add(cityLyr);
  
});