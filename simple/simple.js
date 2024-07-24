
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
    center: [25.89,-15.73]  //-15.733302, 25.894230
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
      //id: "4e1b261719ca421b9555ee6eb99bab8c"
      id: "63256713fc3e4e26aefd2f21d342f64a" //using the updated layer ID of [0]
    },
    renderer: cityRenderer
  });

  
  
  
  map.add(cityLyr);
  
});