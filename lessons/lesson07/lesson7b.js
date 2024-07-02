

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
    title: "{NAME}, {ST_ABBREV}: insert % here Gen X",
    content: "Gen X represents % of the population in {NAME}, {ST_ABBREV}<br/>({GENX_CY} out of the county's total population {TOTPOP_CY})<br/><br/>Other generations:<br/>{OLDRGENSCY} Silent & Greatest Generation (born 1945 or earlier)<br/>{BABYBOOMCY} Baby Boomer (1946-1964)<br/>{MILLENN_CY} Millennial (born 1981-1998)<br/>{GENZ_CY} Gen Z (born 1999-2016)<br/> {GENALPHACY} Gen Alpha (born 2017 or later)",
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
  
  addClass(0, 0.1, "#a6611a", "0-10%", countyRenderer);
  addClass(0.1001, 0.2, "#d8b365", "10-20%", countyRenderer);
  addClass(0.2001, 0.3, "#c7eae5", "20-30%", countyRenderer);
  addClass(0.3001, 0.4, "#5ab4ac", "30-40%", countyRenderer);
  addClass(0.4001, 1.0, "#01665e", "Over 40%", countyRenderer);


  
  //updated portal ID for GenX census data 
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "959588e62d854f588b3ae97c0c86f890"
    },
    renderer: countyRenderer,      
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

