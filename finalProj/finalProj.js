

require([
  "esri/config",
  "esri/core/reactiveUtils",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/core/promiseUtils",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/renderers/visualVariables/SizeVariable",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/widgets/TimeSlider",
  "esri/widgets/TimeSlider/TimeSliderViewModel",
  "esri/TimeInterval",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/Home",
  "esri/widgets/Slider",
  "esri/PopupTemplate"
], (esriConfig, reactiveUtils, Map, MapView, FeatureLayer, promiseUtils, SimpleRenderer, UniqueValueRenderer, SizeVariable, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TimeSlider, TimeSliderVM, TimeInterval, Legend, Expand, Home, Slider, PopupTemplate) => {


	/*********************************
	* API Key token to access private 
	*********************************/

 	esriConfig.apiKey= "AAPTxy8BH1VEsoebNVZXo8HurGXJlgk9xdfpa0TTnBcauOpVrTqXVoKQed7vZaZ5IDakouaJ3hhnz89sQuIMIe9WpsS-EJpM8e0nKXDZceXTZBg51XBG6XQ9vr4TevgRt1GEbcSHL3X-YE5Ye2UwjKZEjXvQkJyFAkQgOWvuZRqyLL7Gw4GQkYJ770XIcpKgeQ2zCpR-TX55qbg0B_ryGnOkrIfIFAkD0RUbcXedsoGFq74enAXq90mf08FNUZPiryiHAT1_0iCT7va8";

	/*********************************
	* Setup Map 
	*********************************/
/*
	const elephantLyr = new FeatureLayer({
		portalItem: { 
			id: "d43cea74de224770a8bedbd58b770cb2"//ID at sapfira.maps.arcgis.com
		},
	});
	*/

	const map = new Map({
		basemap: "dark-gray-vector"		//hybrid for day
	});

	const view = new MapView({
		container: "viewDiv",
		map: map,
		zoom: 11,
		center: [25.97,-15.87]  // Kafue National Park release area
	});


	/*********************************
	* Initialize time slider widget
	*********************************/

	const timeSlider = new TimeSlider({
		container: "timeSlider",
		view: view,		//this shows only points included in time view
		mode: "time-window",
		timeVisible: true, // show the time stamps on the timeslider
		playRate: 100,
		loop: true,
	});
	view.ui.add(timeSlider);


	/*********************************
	* Add home button widget
	*********************************/

	const homeBtn = new Home({
		view: view
	});

	view.ui.add(homeBtn, "top-left");
	view.ui.add("titleDiv", "top-right");


	/*********************************
	* Create popup template for elephant layer
	*********************************/

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

	/*********************************
	* Add symbology for elephant layer 
	* This is getting crazy, just model after the earthquake code
	*********************************/

	const elephantRenderer = new UniqueValueRenderer({
		field: "ElephantName",
		legendOptions: {
			title: "Elephants"
		}
	});

	const sizeVisualVariable = {
		type: "size",
		field: "Speed_km_h",
		legendOptions: {
			title: "Rate of Speed (km/h) - increased speed can be an indicator of fear"
		},
		minDataValue: 1,
		maxDataValue: 8,
		minSize: 10,
		maxSize: 60
	};

/*
	const addClass = function(val, colr, renderer) {  //passing in an array
		renderer.addUniqueValueInfo({
			value: val,
			symbol: new SimpleMarkerSymbol({
				style: "circle",
				color: colr,			//does this need to be in an array too?
				outline: {			// autocasts as new SimpleLineSymbol()
					color: [128,128,128,0.5],
					width: "0.5px"
				},
				visualVariables: [{
					type: "size",			// size visual variable
					field: "Speed_km_h",	// speed estimated by GPS collar
					stops: [{
						value: 1,		// features where speed < 1 km/h
						size: 4,		// assigned a marker with this size in pts
						label: "less than 1 km/h"	// label to display in legend
					},
					{
						value: 5,		// features where speed > 5 km/h
						size: 24,		// assigned a marker with this size in pts
						label: "more than 5 km/h"
					}]
				}]
			})
		})
	};

*/

	const addClass = function(val, colr) {
		var sym = new SimpleMarkerSymbol({
			style: "circle",
			color: colr,
			outline: {
				color: [128,128,128,0.5],
				width: "0.5px"
			}
		})
		elephantRenderer.addUniqueValueInfo({
			value: val,
			symbol: sym,

		})

	};


	addClass("Batoka", [102,194,165,.5]);	//RGB color values, transparent
	addClass("Chamma", [231,138,195,.5]);
	addClass("Tafika", [166,216,84,.5]);

	elephantRenderer.visualVariables = [sizeVisualVariable];



/*
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
  
  addClass(1.600000, 5.000000, "#ffffb2", "1.600000 - 5.0", quakeRenderer);
  addClass(5.000001, 5.900000, "#fd8d3c", "5.000001 - 5.9", quakeRenderer);
  addClass(5.900001, 6.900000, "#f03b20", "5.900001 - 6.9", quakeRenderer);
  addClass(6.900001, 9.000000, "#bd0026", "6.900001 - 9.0", quakeRenderer);




	const elephantRenderer = {
		type: "unique-value", 	// autocasts as new UniqueValueRenderer()
		field: "ElephantName",
		legendOptions: {
		  title: "Elephants"   
		},
		uniqueValueInfos: [
			{
				value: "Batoka",
				symbol: createSymbol("#00c3ff"),
				label: "Batoka"
			},
			{
				value: "Chamma",
				symbol: createSymbol("#ff002e"),
				label: "Chamma"
			},
			{
				value: "Tafika",
				symbol: createSymbol("#faff00"),
				label: "Tafika"
			}
		]
	};

	elephantLyr.addUniqueValueInfo({

	})

  const addClass = function(val, renderer) {
    var sym;
    if (val == "Batoka") {
      sym = new PointSymbol2D({
        symbolLayers: [
          new IconSymbol3DLayer({
            material: { color: [235, 244, 66, 0.7] },
            resource: { primitive: "circle" },
            size: 12,
            outline: {
              color: "black",
              size: 0.5
            }
          }),
          new IconSymbol3DLayer({
            resource: { primitive: "cross" },
            size: 8,
            outline: {
              color: "black",
              size: 0.5
            }
          })
        ]
      });
    } else {
      lbl = "No";
      sym = new PointSymbol3D({
        symbolLayers: [new IconSymbol3DLayer({
          material: { color: "gray" },
          resource: { primitive: "circle" },
          size: 12
        })]
      })
    }
    renderer.addUniqueValueInfo({
      value: val,
      symbol: sym,
      label: lbl
    });      
  }
  
  addClass(1, cityRenderer);
  addClass(0, cityRenderer);
   
  const cityLyr = new FeatureLayer({
    portalItem: { 
      id: "5af96a04ef4c4d8a9bb2a9dd2c883e36"
    },
    renderer: cityRenderer     
  });  
  
  map.add(cityLyr)

	function createSymbol(color) {
		return {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: color,
			outline: {
				width: 0.2,
				color: [0, 0, 0, 0.1]
			}
		};
	};




	const elephantSym = new SimpleMarkerSymbol({
		color: "white",
		style: "circle",
		size: 2    
	});

	//Renders each elephant data point using two visual variables:
	//  Color - indicates a unique elephant 
	//  Size - indicates speed 

	const referenceScale = 1244650;

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
					{value: referenceScale, size: 25},
					{value: referenceScale*2, size: 20},
					{value: referenceScale*4, size: 15},
					{value: referenceScale*8, size: 10}
				]
			}
		},
		{
			type: "color",
            field: "ElephantName",
            stops: [
                { value: "Batoka", color: "#2b83ba" },
                { value: "Chamma", color: "#abdda4" },
                { value: "Tafika", color: "#ffffbf" }
            ]
        }]
    });

/*
  const elephantLyr = new FeatureLayer({
      portalItem: {
        id: "d43cea74de224770a8bedbd58b770cb2"
      },
      title: "Elephant Data",
      minScale: 72223.819286,
      renderer: elephantRenderer,
      effect: "bloom(2.5 0 0.5)"
    });
*/

	const elephantLyr = new FeatureLayer({
		portalItem: { 
		  id: "d43cea74de224770a8bedbd58b770cb2"//ID at sapfira.maps.arcgis.com
		},
		title: "Elephant Data",
		renderer: elephantRenderer,
		effect: "bloom(.5 0 0)",
		popupTemplate: template
	});
  
	map.add(elephantLyr);



	/****************************************
	* Add TimeSlider displaying elephant tracking data by day
	****************************************/

	view.whenLayerView(elephantLyr).then((lv) => {
		timeSlider.fullTimeExtent = elephantLyr.timeInfo.fullTimeExtent.expandTo("hours");
		timeSlider.timeExtent = {
			start: new Date("5/24/2023"),
			end: new Date("5/25/2023")
		};
		timeSlider.stops = {
		    interval: {
		      	value: 1,
		      	unit: "hours"
		  	} 
		};
	});



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

	const legendExpand = new Expand({
		expandIcon: "legend",
		expandTooltip: "Legend",
		view: view,
		content: legend,
		expanded: false
	});
	view.ui.add(legendExpand, "top-left");


	timeSlider.play();

	reactiveUtils.watch(
	  () => timeSlider.timeExtent,
	  (timeExtent) => {
	    console.log("Time extent now starts at", timeExtent.start, "and finishes at:", timeExtent.end);
	  }
	);
/*
	reactiveUtils.watch(
	  () => timeSlider.timeExtent,
	  (value) => {
	    // update layer view filter to reflect current timeExtent
	    timeLayerView.filter = {
	      timeExtent: value
	    };
	  }
	);
	*/
	

	//console.log("The layer's time interval is ", elephantLyr.timeInfo.interval.value, " ", elephantLyr.timeInfointerval.unit);

	// Display the current state of the view model.
	switch (timeSlider.viewModel.state) {
	  case "disabled":
	    console.log("The view is not ready or some property are not set.");
	    break;
	  case "ready":
	    console.log("The time slider is ready for use.");
	    break;
	  case "playing":
	    console.log("The time slider is currently animating.");
	    break;
	}

  
});