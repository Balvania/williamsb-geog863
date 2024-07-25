
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
  "esri/widgets/Home",
  "esri/widgets/Slider",
  "esri/PopupTemplate"
], (esriConfig, Map, MapView, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Legend, Home, Slider, PopupTemplate) => {

 	esriConfig.apiKey= "AAPTxy8BH1VEsoebNVZXo8HurGXJlgk9xdfpa0TTnBcauOpVrTqXVoKQed7vZaZ5IDakouaJ3hhnz89sQuIMIe9WpsS-EJpM8e0nKXDZceXTZBg51XBG6XQ9vr4TevgRt1GEbcSHL3X-YE5Ye2UwjKZEjXvQkJyFAkQgOWvuZRqyLL7Gw4GQkYJ770XIcpKgeQ2zCpR-TX55qbg0B_ryGnOkrIfIFAkD0RUbcXedsoGFq74enAXq90mf08FNUZPiryiHAT1_0iCT7va8";



/*
	const elephantLyr = new FeatureLayer({
		portalItem: { 
		  id: "d43cea74de224770a8bedbd58b770cb2"//ID at sapfira.maps.arcgis.com
		},
		renderer: elephantRenderer,
		popupTemplate: template
	});

	*/

	const map = new Map({
		basemap: "dark-gray-vector"
	});

	const view = new MapView({
		container: "viewDiv",
		map: map,
		zoom: 9,
		center: [25.89,-15.73]  //-15.733302, 25.894230
	});


	/*********************************
	* Add home button widget
	*********************************/

	const homeBtn = new Home({
		view: view
	});

	view.ui.add(homeBtn, "top-left");


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
			field: "Speed_km_h",
			minDataValue: 1,
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
			},
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
        id: "d43cea74de224770a8bedbd58b770cb2"
      },
      title: "Elephant Data",
      minScale: 72223.819286,
      renderer: elephantRenderer,
      effect: "bloom(2.5 0 0.5)"
    });

  
	map.add(elephantLyr);

	/****************************************
	* Add legend
	****************************************/
	const legend = new Legend({
		view: view,
		layerInfos: [{
			layer: elephantLyr,
			title: "GRI Post-Release Data (May-Sept 2023)"
		}]
	});

	view.ui.add(legend, "bottom-left");  
  
});