
require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer"], (
        Map,
        MapView,
        MapImageLayer) => {

        /*****************************************************************
         * Create a renderer for the dynamic data layer (table).
         *****************************************************************/

        const renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255, 0.5],
            width: 0.75,
            style: "long-dash-dot-dot"
          }
        };

      	// create a MapImageLayer instance pointing to the USA map service
      	const layer = new MapImageLayer({
	          url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
	          sublayers: [
	            {
	              id: 2,
	              visible: true
	            },
	            {
	              id: 4,
	              visible: false,
	              title: "Railroads",
	              renderer: renderer,
	              source: {
	                // indicates the source of the sublayer is a dynamic data layer
	                type: "data-layer",
	                // this object defines the data source of the layer
	                // in this case it's a feature class table from a file geodatabase
	                dataSource: {
	                  type: "table",
	                  // workspace name
	                  workspaceId: "MyDatabaseWorkspaceIDSSR2",
	                  // table name
	                  dataSourceName: "ss6.gdb.Railroads"
	                }
	              }
	            },
	            {
	              id: 1,
	              visible: true
	            },
	            {
	              id: 0,
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
        });


        /*****************************************************************
         * Wait for Layer to load and update the page to refelect which
         * layers are visible in the Map Service.
         *****************************************************************/
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
         *****************************************************************/
        const sublayersElement = document.querySelector(".sublayers");
        sublayersElement.addEventListener("click", (event) => {
          const id = event.target.getAttribute("data-id");
          if (id) {
            const sublayer = layer.findSublayerById(parseInt(id));
            const node = document.querySelector(".sublayers-item[data-id='" + id + "']");
            sublayer.visible = !sublayer.visible;
            node.classList.toggle("visible-layer");
          }
        });
      });
