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
		 *********************************/

		const homeBtn = new Home({
		  	view: view
		});

		view.ui.add(homeBtn, "top-left");



		//const stateSelect = document.getElementById("list_elephants");


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

		/****************************************
		 * Pull list of unique state values from feature layer
		 * then display in sidebar panel
		 ****************************************/

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
		 ****************************************/

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
		 ****************************************/
		const legend = new Legend({
			view: view,
			layerInfos: [{
				layer: countyLyr,
				title: "Gen X Population by County (born 1965 to 1980)"
			}]
		});

		view.ui.add(legend, "bottom-left");  
  
});