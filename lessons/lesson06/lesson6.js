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
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend"
], (Map, SceneView, Camera, FeatureLayer, ClassBreaksRenderer, PointSymbol3D, ObjectSymbol3DLayer, SimpleLineSymbol, Legend) => {

  const map = new Map({
    basemap: "dark-gray-vector",
    ground: "world-elevation"
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: new Camera({
      position: [-97.79200180463765, 22.838904311683287, 4500250.561209338],
      heading: 0.8527275004528952,
      tilt: 17.84993189787995
    })
  });
  
  const template = {
    title: "Earthquake magnitude: {MAGNITUDE}<br/>{NAME}",
    content: "{DATE_}<br/><br/><br/> tsunami: {TSU}<br/> number of deaths: {NUM_DEATHS} {HIST_DEATHS}<br/>number injured: {NUM_INJURED} {HIST_INJURED}<br/>number of houses destroyed: {NUM_HOUSES_DEST} {HIST_HOUSES_DEST}",
    fieldInfos: [{
      fieldName: "MAGNITUDE",
      format: {
        places: 2
      },
      fieldName: "DATE_",
      format: {
        dateFormat: "short-date"
      }

    }]
  };  
  

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
        symbolLayers: [
          new ObjectSymbol3DLayer({
            material: {color: clr},
            resource: {primitive: "inverted-cone"},
            height: 100000,
            width: 100000, 
            outline: {
              color: "black",
              size: 1
            }
          })
        ]
      }),
      label: lbl
    });
  }
  
  addClass(1.600000, 5.000000, "#d7b5d8", "1.600000 - 5.0", quakeRenderer);
  addClass(5.000001, 5.900000, "#df65b0", "5.000001 - 5.9", quakeRenderer);
  addClass(5.900001, 6.900000, "#dd1c77", "5.900001 - 6.9", quakeRenderer);
  addClass(6.900001, 9.000000, "#980043", "6.900001 - 9.0", quakeRenderer);
   

  const quakeLayer = new FeatureLayer({
    portalItem: { 
      id: "7d68c73f72b24cb0af61a96cc9b8fb16"
    },
    renderer: quakeRenderer,      
    popupTemplate: template
  });  
  
  map.add(quakeLayer)
  
  const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: quakeLayer,
      title: "Earthquakes: 1970 - 2009"
    }]
  });

  view.ui.add(legend, "bottom-left");  
  
});

