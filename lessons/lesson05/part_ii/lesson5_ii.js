
require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer"], (
        Map,
        MapView,
        MapImageLayer) => {

      	// create a MapImageLayer instance pointing to the USA map service
      	const layer = new MapImageLayer({
      		url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
      	})

        // create a map and add the layer
        const map = new Map({
        	basemap: "dark-gray-vector",
        	layers: [layer]
        });

        // Make map view and bind it to the map
        const view = new MapView({
          container: "viewDiv",
          map: map,
          zoom: 4,
          center: [-98.102, 34.501]
        });

      });
