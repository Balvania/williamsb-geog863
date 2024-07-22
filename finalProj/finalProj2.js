/**************************************************************************** 
 * GEOG863 - Final Project - Bernadette Williams
 * Post-Release Tracking of Orphan Elephants: Zambia
 * View GPS tracking data for 3 elephants: Batoka, Chomma, Tafika (May-Sept 2023)
 * EXPANDED UI
 * - add sidebar with links for each elepahant, or view them all 
 * - elephant list is programmatically generated using distinct query
 * - clicking an elephant name link refocuses map on GPS data extent
 * - clicking on point data displays an informational popup window
 * - clicking radio button to view by day or night movements, or all
 * - enter date range to further isolate tracking data
 * - slider bar allows user to view temporal data by timestamp
 * - aggregate 
 * - home button widget returns user to initial map extent
 * 
 * 
 * Created: 25 July 2024
 ****************************************************************************/

  require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/TimeSlider",
      "esri/widgets/Expand",
      "esri/widgets/Legend"
    ], (Map, MapView, FeatureLayer, TimeSlider, Expand, Legend) => {

    	// portal ID for elephant dataset
		const elephantLyr = new FeatureLayer({
			portalItem: { 
				id: "546638e0edb84d5c9cdde04686dddb89"
			},    
			popupTemplate: ele_template
		});  

		map.add(elephantLyr);  //displays full country


		const map = new Map({
			basemap: "dark-gray-vector",
			ground: "world-elevation",
			layers: [layer]
		});

		const view = new MapView({
			map: map,
			container: "viewDiv",
			zoom: 4,
			center: [-100, 30]
		});

		// time slider widget initialization
		const timeSlider = new TimeSlider({
			container: "timeSlider",
			view: view,
			timeVisible: true, // show the time stamps on the timeslider
			loop: true
		});

		// add the UI for a title
		view.ui.add("titleDiv", "top-right");


		view.whenLayerView(layer).then((lv) => {
			// around up the full time extent to full hour
			timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent.expandTo("days");
			timeSlider.stops = {
			  interval: layer.timeInfo.interval
			};
		});

		const legend = new Legend({
			view: view
		});

		const legendExpand = new Expand({
			expandIcon: "legend",
			expandTooltip: "Legend",
			view: view,
			content: legend,
			expanded: false
		});

		view.ui.add(legendExpand, "top-left");
	});


/***

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend",
  "esri/PopupTemplate",
  "esri/rest/support/Query",
  "esri/widgets/Home"
  ], (Map, MapView, Search, FeatureLayer, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Legend, PopupTemplate, Query, Home) => {


		//declare state variable
		var state; 

		const stateSelect = document.getElementById("list_elephants");

		const map = new Map({
			basemap: "dark-gray-vector",
			ground: "world-elevation"
		});

		const view = new MapView({
			container: "viewDiv",
			map: map,
			center: [-105, 50],  //map display centered on continental U.S.
			zoom: 3
		});

		/*********************************
		 * Add home button widget
		 *********************************

		const homeBtn = new Home({
		  	view: view
		});

		view.ui.add(homeBtn, "top-left");



		//const stateSelect = document.getElementById("list_elephants");


		/*********************************
		 * Elephants in dataset:
			BATOKA 
			CHAMMA 
			TAFIKA 
		**********************************

		// Create popup template for county layer
		const template = {
			title: "{NAME}, {ST_ABBREV}: {expression/genXpercent}% Gen X",
			content: [
			{
			  type: "text",
			  text: 
			    "Gen X represents {expression/genXpercent}% of the population in {NAME}, {ST_ABBREV}.<br/>" +
			    "<em>({GENX_CY} out of this county's total population {TOTPOP_CY})</em><br/><br/>" +
			    "<u>Other generational populations:</u><br/>  - {OLDRGENSCY} Silent & Greatest Generation (born 1945 or earlier)<br/>" +
			    "  - {BABYBOOMCY} Baby Boomer (1946-1964)<br/>  - {MILLENN_CY} Millennial (1981-1998)<br/>" +
			    "  - {GENZ_CY} Gen Z (1999-2016)<br/>  - {GENALPHACY} Gen Alpha (born 2017 or later)",
			}],
			expressionInfos: [
			{
			  name: "genXpercent",
			  expression: "($feature.GENX_CY/$feature.TOTPOP_CY)*100"
			}],
			fieldInfos: [
			{
			  fieldName: "expression/genXpercent",
			  format: {
			    digitSeparator: true,
			    places: 0
			  }
			},
			{
			  fieldName: "GENX_CY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "TOTPOP_CY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "OLDRGENSCY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "BABYBOOMCY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "MILLENN_CY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "GENZ_CY",
			  format: {
			    digitSeparator: true
			  }
			},
			{
			  fieldName: "GENALPHACY",
			  format: {
			    digitSeparator: true
			  }
			}]
		};  


// Create popup template for elephant layer
		const ele_template = {
			title: "{ElephantName} ({Tag})",
			content: [
			{
			  type: "text",
			  text: 
			    "Timestamp: {TimeStamp_orig}<br/>" +
			    "{ElephantName} {Day_Night_ind} movement at a speed of {Speed}.<br/>" +
			    "Accelerometer reading: {Accelerometer}<br/>" +
			    "Tag model: {Type}<br/>" +
			    "Software version: {SWVer}<br/>" +
			    "Coverage: {Coverage}<br/>" +
			    "Transmission Retries: {Retries}",
			}]
		};  

		// Create renderer to display the Gen X % population, normalized by the Total Population field
		const countyRenderer = new ClassBreaksRenderer({
			field: "GENX_CY", // total Generation X (born 1965 to 1980)
			normalizationField: "TOTPOP_CY",  // total Population
			legendOptions: {
			  title: "% Population (per 2018 Census)"   
			}
		});


		const addClass = function(min, max, clr, lbl, renderer) {
			renderer.addClassBreakInfo({
				minValue: min,
				maxValue: max,
				symbol: new SimpleFillSymbol({
					color: clr,
					outline: {   
						color: "black",
						size: 1
					},
					style: "solid"
				}),
				label: lbl
			})      
		};

		addClass(0, 0.1, "#a6611a", "Less than 10%", countyRenderer);
		addClass(0.100001, 0.15, "#d8b365", "10-15%", countyRenderer);
		addClass(0.150001, 0.20, "#c7eae5", "15-20%", countyRenderer);
		addClass(0.200001, 0.25, "#5ab4ac", "20-25%", countyRenderer);
		addClass(0.250001, 1.0, "#01665e", "Over 25%", countyRenderer);


		// portal ID for GenX census data 
		const countyLyr = new FeatureLayer({
			portalItem: { 
				id: "959588e62d854f588b3ae97c0c86f890"
			},
			renderer: countyRenderer,      
			popupTemplate: template
		});  

		map.add(countyLyr);  //displays full country

		// portal ID for elephant dataset
		const elephantLyr = new FeatureLayer({
			portalItem: { 
				id: "546638e0edb84d5c9cdde04686dddb89"
			},
			renderer: countyRenderer,      
			popupTemplate: ele_template
		});  

		map.add(elephantLyr);  //displays full country

		/****************************************
		 * Pull list of unique state values from feature layer
		 * then display in sidebar panel
		 ****************************************

		countyLyr.when(function() {
			const stateQuery = new Query({
				where: "ST_ABBREV is not null",
				orderByFields: ["ST_ABBREV"],
				returnGeometry: false,
				returnDistinctValues: true,
				outFields: ["ST_ABBREV"]
			});
			countyLyr.queryFeatures(stateQuery).then(displayResults);
		})

		function displayResults(results) {
			const fragment = document.createDocumentFragment();
			results.features.forEach(function(state, index) {
				const attributes = state.attributes;
				const name = attributes.ST_ABBREV;

				const li = document.createElement("li");
				li.classList.add("panel-result");
				li.tabIndex = 0;
				li.setAttribute("list_elephants", index);
				li.textContent = name;

				fragment.appendChild(li);
			});
			stateSelect.innerHTML = "";
			stateSelect.appendChild(fragment);
		}

		/****************************************
		 * Event Listener for click on State list
		 * Zoom to extent of chosen State
		 ****************************************

		stateSelect.addEventListener("click", onListClickHandler);

		function onListClickHandler(event) {   
			const target = event.target;
			const resultId = target.getAttribute("list_elephants");
			const getState = target.textContent;
			console.log("user selected " + resultId + ": " + getState);

			if (getState) {
				const newStateQuery = new Query({
					where: "ST_ABBREV = '" + getState + "'",
					returnGeometry: true
				});
				countyLyr.when(() => {
					return countyLyr.queryExtent(newStateQuery);
				})
				.then((response) => {
					view.goTo(response.extent);
				});
			}
		};


		/****************************************
		 * Add legend
		 ****************************************
		const legend = new Legend({
			view: view,
			layerInfos: [{
				layer: countyLyr,
				title: "Gen X Population by County (born 1965 to 1980)"
			}]
		});

		view.ui.add(legend, "bottom-left");  
  
});




/***
 * time slider code
 * 
 * ///time slider
<html lang="en">

  <head>
    <meta charset="utf-8" />
    <meta name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>TimeSlider widget and time zone | Sample | ArcGIS Maps SDK for JavaScript 4.30</title>
    <script type="module" src="https://js.arcgis.com/calcite-components/2.8.5/calcite.esm.js"></script>
    <link rel="stylesheet" type="text/css" href="https://js.arcgis.com/calcite-components/2.8.5/calcite.css"/>
    <link rel="stylesheet" href="https://js.arcgis.com/4.30/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.30/"></script>

    <style>
      html,
      body,
      #viewDiv {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }

      #timeSlider {
        position: absolute;
        left: 5%;
        right: 5%;
        bottom: 20px;
      }

      #titleDiv {
        padding: 10px;
        font-weight: 36;
        text-align: center;
      }
    </style>
    <script>
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/TimeSlider",
      "esri/widgets/Expand",
      "esri/widgets/Legend",
      "esri/widgets/TimeZoneLabel"
    ], (
        Map,
        MapView,
        FeatureLayer,
        TimeSlider,
        Expand,
        Legend,
        TimeZoneLabel
      ) => {
      const layer = new FeatureLayer({
        url:
          "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_Precipitation_v1/FeatureServer/0"
      });

      const map = new Map({
        basemap: "hybrid",
        layers: [layer]
      });

      const view = new MapView({
        map: map,
        container: "viewDiv",
        zoom: 4,
        center: [-100, 30]
      });

      // time slider widget initialization
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        view: view,
        timeVisible: true, // show the time stamps on the timeslider
        loop: true
      });

      // add the UI for a title
      view.ui.add("titleDiv", "top-right");


      view.whenLayerView(layer).then((lv) => {
        // around up the full time extent to full hour
        timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent.expandTo("hours");
        timeSlider.stops = {
          interval: layer.timeInfo.interval
        };
      });



      // calcite input time zone component allows users to pick from one of the IANA
      // time zones without having to add the time zones manually to a drop down
      const timezonePicker = document.getElementById("timezone-picker");
      view.ui.add("timezone-picker", "top-right");

      // Change the map view's time zone when user picks a time zone from the component
      timezonePicker.addEventListener("calciteInputTimeZoneChange", () => {
        view.timeZone = timezonePicker.value;
      });


       // TimeZoneLabel lets users know what the time zone of the view is.
       // This provides an important context to users how the date and times are displayed
      view.ui.add(new TimeZoneLabel({ view: view }), "top-left");

      const legend = new Legend({
        view: view
      });
      const legendExpand = new Expand({
        expandIcon: "legend",
        expandTooltip: "Legend",
        view: view,
        content: legend,
        expanded: false
      });
      view.ui.add(legendExpand, "top-left");
    });
  </script>
  </head>

  <body>
    <div id="viewDiv"></div>
    <div id="timeSlider"></div>
    <div id="titleDiv" class="esri-widget">
      <div id="titleText">Precipitation forecast for next 72 hours </div>
    </div>
    <calcite-input-time-zone mode="name" id="timezone-picker"></calcite-input-time-zone>
  </body>

</html>
***/