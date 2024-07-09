
/**************************************************************************** 
 * GEOG863 - Lesson 8 - Bernadette Williams
 * Generational Demographics of the United States 
 * % Population of Gen X by county
 * 
 * Created: 3 July 2024
 ****************************************************************************/

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend",
  "esri/PopupTemplate"
  ], (Map, MapView, Search, FeatureLayer, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Legend, PopupTemplate) => {

  //capture user input
  let state = prompt("Enter a State abbreviation to view Gen X % population by county", "example: AK");

  //verify user input has been captured in state variable
  console.log("The user entered " + state);

  //create query statement
  //const stateWhere = "ST_ABBREV = " + state;


  const map = new Map({
    basemap: "dark-gray-vector",
    ground: "world-elevation"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-105, 50],  
    zoom: 3
  });


/*Generational data fields:
  OLDRGENSCY - Silent & Greatest Generations (born 1945 or earlier)
  BABYBOOMCY - Baby Boomer (born 1946 to 1964)
  GENX_CY - Generation X (born 1965 to 1980)
  MILLENN_CY - Millennial (born 1981 to 1998)
  GENZ_CY - Generation Z (born 1999 to 2016)
  GENALPHACY - Generation Alpha (born 2017 or later)
*/


// Create popup template
  const template = {
    title: "{NAME}, {ST_ABBREV}: {expression/genXpercent}% Gen X",
    content: [
    {
      type: "text",
      text: 
        "Gen X represents {expression/genXpercent}% of the population in {NAME}, {ST_ABBREV}.<br/>" +
        "<em>({GENX_CY} out of this county's total population {TOTPOP_CY})</em><br/><br/>" +
        "<u>Other generational populations:</u><br/>  - {OLDRGENSCY} Silent & Greatest Generation (born 1945 or earlier)<br/>" +
        "  - {BABYBOOMCY} Baby Boomer (1946-1964)<br/>  - {MILLENN_CY} Millennial (1981-1998)<br/>" +
        "  - {GENZ_CY} Gen Z (1999-2016)<br/>  - {GENALPHACY} Gen Alpha (born 2017 or later)",
    }],
    expressionInfos: [
    {
      name: "genXpercent",
      expression: "($feature.GENX_CY/$feature.TOTPOP_CY)*100"
    }],
    fieldInfos: [
    {
      fieldName: "expression/genXpercent",
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
  
  addClass(0, 0.1, "#a6611a", "Less than 10%", countyRenderer);
  addClass(0.100001, 0.15, "#d8b365", "10-15%", countyRenderer);
  addClass(0.150001, 0.20, "#c7eae5", "15-20%", countyRenderer);
  addClass(0.200001, 0.25, "#5ab4ac", "20-25%", countyRenderer);
  addClass(0.250001, 1.0, "#01665e", "Over 25%", countyRenderer);


  //add basic query for state abbreviation selected by user
  //updated portal ID for GenX census data 
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "959588e62d854f588b3ae97c0c86f890"
    },
    definitionExpression: "ST_ABBREV = '" + state + "'",
    renderer: countyRenderer,      
    popupTemplate: template
  });  
  

  map.add(countyLyr);

  //after layer is loaded, add zoom to extent of user's State selection
  countyLyr.when(() => 
  {
    return countyLyr.queryExtent();
  })
  .then((response) => 
  {
    view.goTo(response.extent);
  });
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: countyLyr,
      title: "Gen X Population by County (born 1965 to 1980)"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});
