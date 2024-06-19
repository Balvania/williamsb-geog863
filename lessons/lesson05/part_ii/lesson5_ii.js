
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
	            	visible: true
	            },
	            {
	            	id: 1,			// Highways Layer
	            	visible: true
	            },
	            {
	              	id: 2,			// States Layer
	              	visible: true
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


        /*****************************************************************
         * Wait for Layer to load and update the page to refelect which
         * layers are visible in the Map Service.
         *****************************************************************
        layer.when(() => {
          layer.sublayers.map((sublayer) => {
            const id = sublayer.id;
            const visible = sublayer.visible;
            const node = document.querySelector(".sublayers-item[data-id='" + id + "']");
            if (visible) {
              node.classList.add("visible-layer");
            }
          });
        });

        /*****************************************************************
         * Listen for when buttons on the page have been clicked to turn
         * layers on and off in the Map Service.
         *****************************************************************
        const sublayersElement = document.querySelector(".sublayers");
        sublayersElement.addEventListener("click", (event) => {
          const id = event.target.getAttribute("data-id");
          if (id) {
            const sublayer = layer.findSublayerById(parseInt(id));
            const node = document.querySelector(".sublayers-item[data-id='" + id + "']");
            sublayer.visible = !sublayer.visible;
            node.classList.toggle("visible-layer");
          }
        }); */
      });
