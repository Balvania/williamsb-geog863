

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
    field: "GENX_CY",
    normalizationType: "percent-of-total",
    normalizationTotal: "TOTPOP_CY",
    legendOptions: {
      title: "Gen X % Population per Country"   
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
  
  addClass(0, 0.25, "#eff3ff", "50 and under", countyRenderer);
  addClass(0.25001, 0.5, "#bdd7e7", "51 - 150", countyRenderer);
  addClass(0.50001, 0.75, "#6baed6", "151 - 250", countyRenderer);
  addClass(0.75001, 1.0, "#3182bd", "251 - 500", countyRenderer);
  
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

