

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

// Create popup template
  const template = {
    title: "Gen X population in {NAME}, {ST_ABBREV}: insert % here",
    content: "Gen X represents % of the population in {NAME} ({GENX_CY} out of the total population {TOTPOP_CY}<br/>Other generations:<br/>Silent & Greatest Generation: {OLDRGENSCY}<br/>Baby Boomer: {BABYBOOMCY}<br/>Millennial: {MILLENN_CY}<br/>Gen Z: {GENZ_CY}<br/>Gen Alpha: {GENALPHACY}",
    fieldInfos: [{
      fieldName: "GENX_CY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "TOTPOP_CY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "OLDRGENSCY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "BABYBOOMCY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "MILLENN_CY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "GENZ_CY",
      format: {
        digitSeparator: true
      }
    },
    {
      fieldName: "GENALPHACY",
      format: {
        digitSeparator: true
      }
    }]
  };  

// Create renderer to display the Gen X % population, normalized by the Total Population field
  const countyRenderer = new ClassBreaksRenderer({
    field: "GENX_CY", // total Generation X (born 1965 to 1980)
    normalizationField: "TOTPOP_CY",  // total Population
    legendOptions: {
      title: "Gen X % Population per County"   
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
  
  addClass(0, 0.2, "#f0f9e8", "0-20%", countyRenderer);
//  addClass(0.1001, 0.2, "#ccebc5", "10-20%", countyRenderer);
  addClass(0.2001, 0.4, "#a8ddb5", "20-40%", countyRenderer);
//  addClass(0.3001, 0.4, "#7bccc4", "30-40%", countyRenderer);
  addClass(0.4001, 0.5, "#43a2ca", "40-50%", countyRenderer);
  addClass(0.5001, 1.0, "#0868ac", "Over 50%", countyRenderer);

  
  //updated portal ID for GenX census data 
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "959588e62d854f588b3ae97c0c86f890"
    },
    renderer: countyRenderer      
    popupTemplate: template
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

