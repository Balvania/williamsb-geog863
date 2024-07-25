
/**multivariate example

      require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend"], (
        Map,
        MapView,
        FeatureLayer,
        Legend
      ) => {

        const referenceScale = 9244650;

        // Renders each weather station with three visual variables:
        // Rotation - indicates wind direction
        // Color - indicates air temperature
        // Size - indicates wind speed

        const renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            // Arrow marker
            path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
            color: [250, 250, 250],
            outline: {
              color: [255, 255, 255, 0.5],
              width: 0.5
            },
            angle: 180,
            size: 15
          },
          visualVariables: [
            {
              type: "rotation",
              field: "WIND_DIRECT",
              rotationType: "geographic"
            },
            {
              type: "size",
              field: "WIND_SPEED",
              minDataValue: 0,
              maxDataValue: 60,
              minSize: {
                type: "size",
                valueExpression: "$view.scale",
                // adjust the min size by scale
                stops: [
                  { value: referenceScale, size: 8 },
                  { value: referenceScale*2, size: 6 },
                  { value: referenceScale*4, size: 4 },
                  { value: referenceScale*8, size: 2 }
                ]
              },
              maxSize: {
                type: "size",
                valueExpression: "$view.scale",
                // adjust the max size by scale
                stops: [
                  { value: referenceScale, size: 40 },
                  { value: referenceScale*2, size: 30 },
                  { value: referenceScale*4, size: 20 },
                  { value: referenceScale*8, size: 10 }
                ]
              }
            },
            {
              type: "color",
              field: "TEMP",
              stops: [
                { value: 20, color: "#2b83ba" },
                { value: 35, color: "#abdda4" },
                { value: 50, color: "#ffffbf" },
                { value: 65, color: "#fdae61" },
                { value: 80, color: "#d7191c" }
              ]
            }
          ]
        };

        // Set the renderer on the feature layer
        const layer = new FeatureLayer({
          portalItem: {
            id: "cb1886ff0a9d4156ba4d2fadd7e8a139"
          },
          title: "Current weather conditions",
          renderer: renderer
        });

        const map = new Map({
          basemap: {
            portalItem: {
              id: "ba223f982a3c4a0ea8c9953346e2a201"
            }
          },
          layers: [layer]
        });

        const view = new MapView({
          container: "viewDiv",
          map: map,
          scale: referenceScale * 4,
          center: [ -88, 41 ]
        });

        view.ui.add(new Legend({
          view: view
        }), "bottom-right");
      });
    </script>
  </head>
  <body>
    <div id="viewDiv"></div>
  </body>
</html>

**/

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/widgets/Legend",
  "esri/PopupTemplate"
], (esriConfig, Map, MapView, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Legend, PopupTemplate) => {

 	esriConfig.apiKey= "AAPTxy8BH1VEsoebNVZXo8HurGXJlgk9xdfpa0TTnBcauOrQjYVHt-Q-X36zFGJpK-F7M6lOtbAUffWRWqjBUjaGO88DXhX8wk5HC-qqzmWwGbuDRSHA33WEZDJZwcD7dZClo6RJ7EfmwLRkvLxeduV5d1Ix9YB2JJKcvSR1pLp8T7ofAJK9Cl0-uHgqrz-u8HQ0W-xnHLKaZ-yhuPNdcw40dxQnL-fy7jSE0zBA133MQGioKVBUySA8mfcgacykgEU4AT1_0iCT7va8";

	const map = new Map({
		basemap: "dark-gray-vector"
	});

	const view = new MapView({
		container: "viewDiv",
		map: map,
		zoom: 9,
		center: [25.89,-15.73]  //-15.733302, 25.894230
	});
  
	// Create popup template for elephant layer
	const template = {
		title: "{ElephantName} - {TimeStamp_orig}",
		content: [
		{
		  type: "text",
		  text: 
		    "{Tag}<br/><br/>" +
		    "day/night indicator: {Day_Night_ind}<br/>" +
		    "speed: {Speed}<br/>" +
		    "temp: {Temperature}<br/>" +
		    "accelerometer: {Accelerometer}<br/><br/>" +
		    "tracker: {Type}, sw ver. {SWVer}<br/>" +
		    "coverage (retries): {Coverage} ({Retries})<br/>",
		}]
	};  


	// *** Adding elephant layer *** //
	const elephantSym = new SimpleMarkerSymbol({
		color: "white",
		style: "circle",
		size: 12    
	});


	//Renders each elephant data point using two visual variables:
	//  Color - indicates a unique elephant 
	//  Size - indicates speed 

	const referenceScale = 9244650;

	const elephantRenderer = new SimpleRenderer({
		symbol: elephantSym,   // uses a SimpleMarkerSymbol
		visualVariables: [
		{
			type: "size",
			field: "Speed",
			minDataValue: 0,
			maxDataValue: 7,
			minSize: {
				type: "size",
				valueExpression: "$view.scale",
				// adjust the min size by scale`
				stops: [
					{value: referenceScale, size: 8},
					{value: referenceScale*2, size: 6},
					{value: referenceScale*4, size: 4},
					{value: referenceScale*8, size: 2}
				]
			}
			maxSize: {
				type: "size",
				valueExpression: "$view.scale",
				// adjust the max size by scale
				stops: [
					{value: referenceScale, size: 40},
					{value: referenceScale*2, size: 30},
					{value: referenceScale*4, size: 20},
					{value: referenceScale*8, size: 10}
				]
			}
		},
		{
			type: "color",
            field: "ElephantName",
            stops: [
                { value: 20, color: "#2b83ba" },
                { value: 35, color: "#abdda4" },
                { value: 50, color: "#ffffbf" }
            ]
        }]
    });

  
	const elephantLyr = new FeatureLayer({
		portalItem: { 
		  //id: "5af96a04ef4c4d8a9bb2a9dd2c883e36"
		  //change to elephant layer
		  //id: "4e1b261719ca421b9555ee6eb99bab8c"
		  //id: "63256713fc3e4e26aefd2f21d342f64a" //using the updated layer ID of [0]
		  id: "e0e2d4f92fbd47e3bf6db3b4ee6ec002"//ID at sapfira.maps.arcgis.com
		},
		renderer: elephantRenderer,
		popupTemplate: template
	});
  
	map.add(elephantLyr);

	/****************************************
	* Add legend
	****************************************/
	const legend = new Legend({
		view: view,
		layerInfos: [{
			layer: elephantLyr,
			title: "GRI Post-Release Data (May-Sept 202))"
		}]
	});

	view.ui.add(legend, "bottom-left");  
  
});