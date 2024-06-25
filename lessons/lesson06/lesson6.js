/**************************************************************************** 
 * GEOG863 - Lesson 6 - Bernadette Williams
 * Map of Earthquakes, a historical view 
 * Created: 25 June 2024
 ****************************************************************************/


require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/Camera",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/IconSymbol3DLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend"
], (Map, SceneView, Camera, FeatureLayer, ClassBreaksRenderer, PointSymbol3D, IconSymbol3DLayer, SimpleLineSymbol, Legend) => {

  const map = new Map({
    basemap: "dark-gray-vector",
    ground: "world-elevation"
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: new Camera({
      position: [-99.0558576806134, 30.060254474359134, 5778771.545418959],
      heading: 4.192688971953225,
      tilt: 7.050169987303263
    })
  });
  
  const quakeRenderer = new ClassBreaksRenderer({
    field: "magnitude",
    legendOptions: {
      title: "Magnitude"
    }
  });

  const addClass = function(min, max, clr, lbl, renderer) {
    renderer.addClassBreakInfo({
      minValue: min,
      maxValue: max,
      symbol: new PointSymbol3D({
        symbolLayers: [new IconSymbol3DLayer({
          material: {color: clr},
          outline: {
            color: "black",
            size: 1
          }
        })]
      }),
      label: lbl
    });
  }

/*
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
  */
  
  addClass(1.600000, 5.000000, "#eff3ff", "1.600000 - 5.000000", quakeRenderer);
  addClass(5.000001, 5.900000, "#bdd7e7", "5.000001 - 5.900000", quakeRenderer);
  addClass(5.900001, 6.900000, "#6baed6", "5.900001 - 6.900000", quakeRenderer);
  addClass(6.900001, 9.000000, "#3182bd", "6.900001 - 9.000000", quakeRenderer);
   
  const quakeLayer = new FeatureLayer({
    portalItem: { 
      id: "7d68c73f72b24cb0af61a96cc9b8fb16"
    },
    renderer: quakeRenderer      
  });  
  
  map.add(quakeLayer)
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: quakeLayer,
      title: "Earthquakes: A Historical View"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});
