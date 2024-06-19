
require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer"], (
        Map,
        MapView,
        MapImageLayer) => {


      	// create a MapImageLayer instance pointing to the USA map service
      	const layer = new MapImageLayer({
	          url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
	          sublayers: [
	            {
	            	id: 0,			// Cities Layer
	            	visible: false
	            },
	            {
	            	id: 1,			// Highways Layer
	            	visible: false
	            },
	            {
	              	id: 2,			// States Layer
	              	visible: false
	            },
	            {
	            	id: 3,			// Counties Layer
	            	visible: true
	            }

	          ]
        });

        // create a map and add the layer
        const map = new Map({
        	basemap: "dark-gray-vector",
        	layers: [layer]
        });

        // Make map view and bind it to the map
        const view = new MapView({
          container: "viewDiv",
          map: map,
          center: [-98, 34],
          zoom: 3
        });

      });
