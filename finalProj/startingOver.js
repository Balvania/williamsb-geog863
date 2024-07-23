
/**************************************************************************** 
 * GEOG863 - Lesson 8 - Bernadette Williams
 * Generational Demographics of the United States 
 * % Population of Gen X by county
 * EXPANDED UI
 * - add sidebar with state links
 * - state list is programmatically generated using distinct query on ST_ABBREV field
 * - clicking a state link zooms and refocuses map on state extent
 * - clicking on a county displays an informational popup window
 * - home button widget returns user to initial map extent
 * 
 * 
 * Created: 10 July 2024
 ****************************************************************************/
  

  


require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend",
  "esri/PopupTemplate",
  "esri/rest/support/Query",
  "esri/widgets/Home"
  ], (Map, MapView, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Legend, PopupTemplate, Query, Home) => {


		//declare state variable
		var state; 

		const stateSelect = document.getElementById("list_states");

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
		 *********************************/

		const homeBtn = new Home({
		  	view: view
		});

		view.ui.add(homeBtn, "top-left");




		/*********************************
		 * Generational data fields:
			OLDRGENSCY - Silent & Greatest Generations (born 1945 or earlier)
			BABYBOOMCY - Baby Boomer (born 1946 to 1964)
			GENX_CY - Generation X (born 1965 to 1980)
			MILLENN_CY - Millennial (born 1981 to 1998)
			GENZ_CY - Generation Z (born 1999 to 2016)
			GENALPHACY - Generation Alpha (born 2017 or later)
		**********************************/

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
	      id: "4e1b261719ca421b9555ee6eb99bab8c"
	    },
	    renderer: elephantRenderer
	  });

		map.add(elephantLyr);  //displays full elephant dataset

		/****************************************
		 * Pull list of unique state values from feature layer
		 * then display in sidebar panel
		 ****************************************/
/*
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
				li.setAttribute("list_states", index);
				li.textContent = name;

				fragment.appendChild(li);
			});
			stateSelect.innerHTML = "";
			stateSelect.appendChild(fragment);
		}

		/****************************************
		 * Event Listener for click on State list
		 * Zoom to extent of chosen State
		 ****************************************/

		/*

		stateSelect.addEventListener("click", onListClickHandler);

		function onListClickHandler(event) {   
			const target = event.target;
			const resultId = target.getAttribute("list_states");
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
		 ****************************************/
		const legend = new Legend({
			view: view,
			layerInfos: [{
				layer: elephantLyr,
				title: "Elephants"
			}]
		});

		view.ui.add(legend, "bottom-left");  
  
});