     HTML CSS JS 

    Result
    Skip Results Iframe

EDIT ON

require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/Camera",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/FillSymbol3DLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend"
], (Map, SceneView, Camera, FeatureLayer, ClassBreaksRenderer, PolygonSymbol3D, FillSymbol3DLayer, SimpleLineSymbol, Legend) => {

  const map = new Map({
    basemap: "dark-gray-vector",
    ground: "world-elevation"
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: new Camera({
      position: [-74.5, 36.6, 229000],
      heading: 328,
      tilt: 64
    })
  });
  
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

