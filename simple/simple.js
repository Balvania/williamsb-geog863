
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
		    "tracker: {Type}, sw ver. {SWVer}" +
		    "coverage (retries): {Coverage} ({Retries})<br/>",
		}]
	};  


	// *** Adding elephant layer *** //
	const elephantSym = new SimpleMarkerSymbol({
		color: "yellow",
		style: "square",
		size: 12    
	});


	const elephantRenderer = new SimpleRenderer({
		symbol: elephantSym  // uses a SimpleMarkerSymbol
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