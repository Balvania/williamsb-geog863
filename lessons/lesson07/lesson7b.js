

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend"
  ], (Map, MapView, FeatureLayer, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Legend) => {

  const map = new Map({
    basemap: "dark-gray-vector",
    ground: "world-elevation"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-78, 41],
    zoom: 6
  });
  
  const countySym = new SimpleLineSymbol({
    style: "solid"
  });


  //This doesn't seem to be working
  const countyRenderer = new ClassBreaksRenderer({
    field: "GENX_CY", // total Generation X (born 1965 to 1980)
    normalizationField: "TOTPOP_CY",  // total Population
    legendOptions: {
      title: "Gen X % Population per Country"   
    }
  });


  const addClass = function(min, max, clr, lbl, renderer) {
    renderer.addClassBreakInfo({
      minValue: min,
      maxValue: max,
      symbol: new SimpleFillSymbol({
          color: clr,
          outline: {   
            color: "black",
            size: 1
          },
          style: "solid"
      }),
      label: lbl
    })      
  };
  
  addClass(0, 0.1, "#f0f9e8", "0-10%", countyRenderer);
  addClass(0.1001, 0.2, "#ccebc5", "10-20%", countyRenderer);
  addClass(0.2001, 0.3, "#a8ddb5", "20-30%", countyRenderer);
  addClass(0.3001, 0.4, "#7bccc4", "30-40%", countyRenderer);
  addClass(0.4001, 0.5, "#43a2ca", "40-50%", countyRenderer);
  addClass(0.5001, 1.0, "#0868ac", "Over 50%", countyRenderer);

  
  //updated portal ID for GenX census data 
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "959588e62d854f588b3ae97c0c86f890"
    },
    renderer: countyRenderer      
  });  
  
  map.add(countyLyr)
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: countyLyr,
      title: "GenX Populations"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});

