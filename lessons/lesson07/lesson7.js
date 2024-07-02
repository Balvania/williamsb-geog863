
  
  const countyRenderer = new ClassBreaksRenderer({
    field: "POP1990",
    normalizationField: "SQ_MILES",
    legendOptions: {
      title: "Pop per Sq Mile"   
    }
  });

  const addClass = function(min, max, clr, lbl, renderer) {
    renderer.addClassBreakInfo({
      minValue: min,
      maxValue: max,
      symbol: new PolygonSymbol3D({
        symbolLayers: [new FillSymbol3DLayer({
          material: { color: clr },
          outline: {   
            color: "black",
            size: 1
          }
        })]
      }),
      label: lbl
    });      
  }
  
  addClass(0, 50, "#eff3ff", "50 and under", countyRenderer);
  addClass(51, 150, "#bdd7e7", "51 - 150", countyRenderer);
  addClass(151, 250, "#6baed6", "151 - 250", countyRenderer);
  addClass(251, 500, "#3182bd", "251 - 500", countyRenderer);
  addClass(501, 1000, "#08519c", "over 500", countyRenderer);
   
  const countyLyr = new FeatureLayer({
    portalItem: { 
      id: "0875e77a2ff54dd689e169d7798d0905"
    },
    renderer: countyRenderer      
  });  
  
  map.add(countyLyr)
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: countyLyr,
      title: "Jen & Barry's World"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});



require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/FillSymbol3DLayer",
  "esri/layers/GraphicsLayer",
  "esri/rest/support/Query",
  "esri/widgets/Legend"
], (Map, MapView, FeatureLayer, Graphic, ClassBreaksRenderer, PolygonSymbol3D, FillSymbol3DLayer, GraphicsLayer, Query, Legend) => {

// declare variable for user text
  let text;

/*Generational data fields:
	OLDRGENSCY - Silent & Greatest Generations (born 1945 or earlier)
	BABYBOOMCY - Baby Boomer (born 1946 to 1964)
	GENX_CY - Generation X (born 1965 to 1980)
	MILLENN_CY - Millennial (born 1981 to 1998)
	GENZ_CY - Generation Z (born 1999 to 2016)
	GENALPHACY - Generation Alpha (born 2017 or later)
*/

//const generation = "what I want";
  const farms = 500;
  const pop = 25000;
  const popdens = 150;
  const crime = 0.02;
  const univ = 1;

// Get user-selected State
// let stateChoice = prompt("Enter a U.S. State to view Gen X demographics: ")

// Select counties where State matches user selection
// this would be better to use a technique where county falls within spatial boundary of state

//const cntyWhere = "ST_ABBREV = " + stateChoice;
  const cntyWhere = "NO_FARMS87 > " + farms + " AND AGE_18_64 > " + pop + " AND POP_SQMILE < " + popdens;
  const cityWhere = "CRIME_INDE <= " + crime + " AND UNIVERSITY = " + univ;

  const map = new Map({
    basemap: "dark-gray-vector"
  });

  //CHANGE THIS TO CENTER ON U.S. AND ALASKA
  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 7,
    center: [-78, 41]
  });

  const countyRenderer = new ClassBreaksRenderer({
    field: "GENX_CY",
    normalizationType: "percent-of-total"
    normalizationTotal: "TOTPOP_CY",
    legendOptions: {
      title: "Gen X Population per County"   
    }
  });

  const addClass = function(min, max, clr, lbl, renderer) {
    renderer.addClassBreakInfo({
      minValue: min,
      maxValue: max,
      symbol: new PolygonSymbol3D({
        symbolLayers: [new FillSymbol3DLayer({
          material: { color: clr },
          outline: {   
            color: "black",
            size: 1
          }
        })]
      }),
      label: lbl
    });      
  }
  
  addClass(0, 20, "#eff3ff", "50 and under", countyRenderer);
  addClass(21, 40, "#bdd7e7", "51 - 150", countyRenderer);
  addClass(41, 60, "#6baed6", "151 - 250", countyRenderer);
  addClass(61, 80, "#3182bd", "251 - 500", countyRenderer);
  addClass(81, 100, "#08519c", "over 500", countyRenderer);
 

  /*THIS WORKED BUT DO NOT NEED IT
  const searchWidget = new Search({
  	view: view
  });

  //Add the search widget to the top right corner of the view
  view.ui.add(searchWidget, {
  	position: "top-right"
  });
  */
  
  //ADD PORTAL ID FOR COUNTY DEMOGRAPHICS
  const counties = new FeatureLayer({
    portalItem: {
      id: "0875e77a2ff54dd689e169d7798d0905"
    }
  });
  
 /*DON'T THINK I NEED THIS ONE
  const cities = new FeatureLayer({
    portalItem: {
      id: "5af96a04ef4c4d8a9bb2a9dd2c883e36"
    }
  });
  */


  const resultsLayer = new GraphicsLayer();
  
  map.addMany([counties, cities, resultsLayer]);

  const cntyQuery = new Query({
    where: cntyWhere,
    returnGeometry: true,
  });
  
  counties.when(function() {
    cities.when(function() {
      return counties.queryFeatures(cntyQuery);
    }).then(findGoodCities);
  });

  function findGoodCities(goodCounties) {
    console.log("The cities meeting your criteria are:");
    goodCounties.features.forEach(function(county) {
      const cityQuery = new Query({
      where: cityWhere,
      geometry: county.geometry,
      returnGeometry: true,
      spatialRelationship: "intersects",
      outFields: ["NAME"]
    });
    
      cities.queryFeatures(cityQuery).then(function(result){displayResults(result,true)});      
    });      
  }
  
  function displayResults(results) {
    const cityFeatures = results.features.map(function(graphic) {
      graphic.symbol = new SimpleMarkerSymbol({
        color: "yellow"
      });      
      console.log(graphic.attributes.NAME) 
      return graphic;
    });
    resultsLayer.addMany(cityFeatures);
  }  
  


});


//{"renderer":{"visualVariables":[{"type":"transparencyInfo","valueExpression":"$feature[\"OLDRGENSCY\"];\n$feature[\"BABYBOOMCY\"];\n$feature[\"GENX_CY\"];\n$feature[\"MILLENN_CY\"];\n$feature[\"GENZ_CY\"];\n$feature[\"GENALPHACY\"];\nvar fieldNames = [ \"OLDRGENSCY\", \"BABYBOOMCY\", \"GENX_CY\", \"MILLENN_CY\", \"GENZ_CY\", \"GENALPHACY\" ];\nvar numFields = 6;\nvar maxValueField = null;\nvar maxValue = -Infinity;\nvar value, i, totalValue = null;\nfor(i = 0; i < numFields; i++) {\nvalue = $feature[fieldNames[i]];\nif(value > 0) {\nif(value > maxValue) {\nmaxValue = value;\nmaxValueField = fieldNames[i];\n}\nelse if (value == maxValue) {\nmaxValueField = null;\n}\n}\nif(value != null && value >= 0) {\nif (totalValue == null) { totalValue = 0; }\ntotalValue = totalValue + value;\n}\n}\nvar strength = null;\nif (maxValueField != null && totalValue > 0) {\nstrength = (maxValue / totalValue) * 100;\n}\nreturn strength;","stops":[{"value":20,"transparency":65},{"value":40,"transparency":0}],"legendOptions":{"title":"Strength of predominance","showLegend":false}},{"type":"sizeInfo","valueExpression":"$feature[\"OLDRGENSCY\"];\n$feature[\"BABYBOOMCY\"];\n$feature[\"GENX_CY\"];\n$feature[\"MILLENN_CY\"];\n$feature[\"GENZ_CY\"];\n$feature[\"GENALPHACY\"];\nvar fieldNames = [ \"OLDRGENSCY\", \"BABYBOOMCY\", \"GENX_CY\", \"MILLENN_CY\", \"GENZ_CY\", \"GENALPHACY\" ];\nvar numFields = 6;\nvar value, i, totalValue = null;\nfor(i = 0; i < numFields; i++) {\nvalue = $feature[fieldNames[i]];\nif(value != null && value >= 0) {\nif (totalValue == null) { totalValue = 0; }\ntotalValue = totalValue + value;\n}\n}\nreturn totalValue;","valueUnit":"unknown","legendOptions":{"title":"Sum of categories"},"minSize":3.75,"maxSize":30,"minDataValue":100000,"maxDataValue":5000000}],"authoringInfo":{"type":"predominance","fields":["OLDRGENSCY","BABYBOOMCY","GENX_CY","MILLENN_CY","GENZ_CY","GENALPHACY"],"visualVariables":[{"type":"transparencyInfo","minSliderValue":0,"maxSliderValue":100}]},"type":"uniqueValue","valueExpression":"$feature[\"OLDRGENSCY\"];\n$feature[\"BABYBOOMCY\"];\n$feature[\"GENX_CY\"];\n$feature[\"MILLENN_CY\"];\n$feature[\"GENZ_CY\"];\n$feature[\"GENALPHACY\"];\nvar fieldNames = [ \"OLDRGENSCY\", \"BABYBOOMCY\", \"GENX_CY\", \"MILLENN_CY\", \"GENZ_CY\", \"GENALPHACY\" ];\nvar numFields = 6;\nvar maxValueField = null;\nvar maxValue = -Infinity;\nvar value, i, totalValue = null;\nfor(i = 0; i < numFields; i++) {\nvalue = $feature[fieldNames[i]];\nif(value > 0) {\nif(value > maxValue) {\nmaxValue = value;\nmaxValueField = fieldNames[i];\n}\nelse if (value == maxValue) {\nmaxValueField = null;\n}\n}\n}\nreturn maxValueField;","valueExpressionTitle":"Predominant category","uniqueValueInfos":[{"value":"OLDRGENSCY","symbol":{"color":[179,0,0,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Silent & Greatest Generations Population (Born 1945/Earlier)"},{"value":"BABYBOOMCY","symbol":{"color":[169,0,230,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Baby Boomer Population (Born 1946 to 1964)"},{"value":"GENX_CY","symbol":{"color":[26,83,255,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Generation X Population (Born 1965 to 1980)"},{"value":"MILLENN_CY","symbol":{"color":[0,183,199,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Millennial Population (Born 1981 to 1998)"},{"value":"GENZ_CY","symbol":{"color":[56,168,0,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Generation Z Population (Born 1999 to 2016)"},{"value":"GENALPHACY","symbol":{"color":[235,220,120,255],"size":6,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSDiamond","outline":{"color":null,"width":0.75,"type":"esriSLS","style":"esriSLSNull"}},"label":"2018 Generation Alpha Population (Born 2017 or Later)”}],"backgroundFillSymbol":{"color":[0,0,0,0],"outline":{"color":[166,166,166,10],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"}},"transparency":0}
