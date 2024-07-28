
/**************************************************************************** 
 * GEOG863 - Final Project - Bernadette Williams
 * Game Rangers International (GRI) Post-Release Elephant Tracking
 * Kafue National Park, Zambia
 * 
 * The GRI Elephant Tracking web app displays GPS collar data for three orphan
 * elephants (Batoka, Chamma, and Tafika) captured during the period from May to September 2023. 
 *  
 * - My final research topic was on Secured Content & Authentication where I
 *   set up my own Esri hosting platform to create an API key token. I used that 
 *   API token to provide secure access to this private feature service of GPS data.
 * - The map initializes with a timeSlider showing a 24 hour window of data points
 *   and is animated to loop through the full data set, then repeat.   
 * - The user can click the pause button to stop the animation, use the forward and
 *   back navigation buttons to step through the data.
 * - The user can adjust the thumbs on the timeSlider to expand the time window or 
 *   view the full data set. 
 * - The map uses multivariate symbology to display data points in a unique color 
 *   for each elephant and continuous size ramp representing the speed captured
 *   by the GPS collar. Speed is an important indicator to GRI animal behaviorists
 *   because it is indicative of a fear response rather than casual foraging behavior.
 * - The user can expand and collapse the legend using the Legend widget
 * - The user can click the home button widget to return to the original map extent
 *   with  state list is programmatically generated using distinct query on ST_ABBREV field
 * - Clicking on a data point displays an informational popup window
 * - This web app was developed using Sublime Text editor, GitHub Desktop, and the 
 *   Digital Ocean web hosting & deployment App Platform.
 * 
 * 
 * Created: 28 July 2024
 ****************************************************************************/

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


	/**************************************************
	* API Key token to access private feature service
	***************************************************/

 	esriConfig.apiKey= "AAPTxy8BH1VEsoebNVZXo8HurGXJlgk9xdfpa0TTnBcauOpVrTqXVoKQed7vZaZ5IDakouaJ3hhnz89sQuIMIe9WpsS-EJpM8e0nKXDZceXTZBg51XBG6XQ9vr4TevgRt1GEbcSHL3X-YE5Ye2UwjKZEjXvQkJyFAkQgOWvuZRqyLL7Gw4GQkYJ770XIcpKgeQ2zCpR-TX55qbg0B_ryGnOkrIfIFAkD0RUbcXedsoGFq74enAXq90mf08FNUZPiryiHAT1_0iCT7va8";

	/*********************************
	* Setup Map 
	*********************************/

	const map = new Map({
		basemap: "dark-gray-vector"		
	});

	const view = new MapView({
		container: "viewDiv",
		map: map,
		zoom: 11,
 		center: [25.97,-15.884]  // Kafue National Park release area
	});


	/*********************************
	* Initialize time slider widget
	*********************************/

	const timeSlider = new TimeSlider({
		container: "timeSlider",
		view: view,						// show only points included in time view
		mode: "time-window",	// provides two thumbs to adjust window
		timeVisible: true, 		// show the time stamps on the timeslider
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


	addClass("Batoka", [102,194,165,.5]);	//RGB color values, transparency
	addClass("Chamma", [231,138,195,.5]);
	addClass("Tafika", [166,216,84,.5]);

	elephantRenderer.visualVariables = [sizeVisualVariable];


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
	* Once elephant layer loads, add TimeSlider 
	* initialized to display elephant GPS data points within a 24-hour window
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
	* Add expandable legend
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

  
});