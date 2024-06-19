
require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer"], (
        Map,
        MapView,
        MapImageLayer
      ) => {

      	// creates a MapImageLayer pointing to the USA map
      	let layer = new MapImageLayer({
      		url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
      	})

        // Create a Map
        const map = new Map();

        // Make map view and bind it to the map
        const view = new MapView({
          container: "viewDiv",
          map: map,
        });

        // adds the layer to the map
        map.add(layer);

      });
