

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

/*Generational data fields:
  OLDRGENSCY - Silent & Greatest Generations (born 1945 or earlier)
  BABYBOOMCY - Baby Boomer (born 1946 to 1964)
  GENX_CY - Generation X (born 1965 to 1980)
  MILLENN_CY - Millennial (born 1981 to 1998)
  GENZ_CY - Generation Z (born 1999 to 2016)
  GENALPHACY - Generation Alpha (born 2017 or later)
*/

  const arcadeExpressionInfos = [
  {
    name: "%-gen-x-arcade",
    title: "% of Gen X in county",
    expression: "Round((($feature.GENX_CY/$feature.TOTPOP_CY)*100,2) + '%'"
  }
];


// Create popup template
  const template = {
    title: "{NAME}, {ST_ABBREV}: {expression/%-gen-x-arcade}% Gen X",
    content: [
    {
      type: "text",
      text: 
        "Gen X represents {expression/%-gen-x-arcade}% of the population in {NAME}, {ST_ABBREV}.<br/>" +
        "({GENX_CY} of county's total population {TOTPOP_CY})<br/><br/>" +
        "Other generations:<br/>{OLDRGENSCY} Silent & Greatest Generation (born 1945 or earlier)<br/>" +
        "{BABYBOOMCY} Baby Boomer (1946-1964)<br/>{MILLENN_CY} Millennial (1981-1998)<br/>" +
        "{GENZ_CY} Gen Z (1999-2016)<br/> {GENALPHACY} Gen Alpha (born 2017 or later)",
    }],
    fieldInfos: [
    {
      fieldName: "expression/%-gen-x-arcade",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
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
    valueExpression: "$feature.GENX_CY / $feature.TOTPOP_CY",
    valueExpressionTitle: "where does this show Households per square mile",
    legendOptions: {
      title: "% Population (per 2018 Census)"   
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
  
  addClass(0, 0.05, "#a6611a", "< 5%", countyRenderer);
  addClass(0.0501, 0.15, "#d8b365", "5-15%", countyRenderer);
  addClass(0.1501, 0.25, "#c7eae5", "15-25%", countyRenderer);
  addClass(0.2501, 0.35, "#5ab4ac", "25-35%", countyRenderer);
  addClass(0.3501, 1.0, "#01665e", "Over 35%", countyRenderer);


  
  //updated portal ID for GenX census data 
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "959588e62d854f588b3ae97c0c86f890"
    },
    renderer: countyRenderer,      
    popupTemplate: template
  });  
  
  template.expressionInfos = arcadeExpressionInfos;

  map.add(countyLyr)
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: countyLyr,
      title: "Gen X Population by County"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});

