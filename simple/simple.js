
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
    basemap: "satellite"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 8,
    center: [-77.5, 40.5]
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

  
  // *** Adding interstates layer *** //
  const hwySym = new SimpleLineSymbol({
    color: "linen",
    style: "solid",
    width: 2,
    opacity: 0.5    
  });
  
  const hwyRenderer = new SimpleRenderer({
    symbol: hwySym    
  });
  
  const hwyLyr = new FeatureLayer({
    portalItem: { 
      id: "b2b9d6856d0742eba55a636c32c94201"
    },
    renderer: hwyRenderer      
  });
  
  
  // *** Adding counties layer *** //
  const countyOlSym = new SimpleLineSymbol({
    style: "dash"    
  });
  
  const countySym = new SimpleFillSymbol({
    color: "gray",
    style: "solid",
    outline: countyOlSym
  });
  
  const countyRenderer = new SimpleRenderer({
    symbol: countySym    
  });
  
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "0875e77a2ff54dd689e169d7798d0905"
    },
    renderer: countyRenderer,
    opacity: 0.5
  });  
  
  map.addMany([countyLyr, hwyLyr, cityLyr]);
  
});