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



      require(["esri/views/MapView", "esri/WebMap"], (MapView, WebMap) => {
        /************************************************************
         * Creates a new WebMap instance. A WebMap must reference
         * a PortalItem ID that represents a WebMap saved to
         * arcgis.com or an on-premise portal.
         *
         * To load a WebMap from an on-premise portal, set the portal
         * url with esriConfig.portalUrl.
         ************************************************************/
        const webmap = new WebMap({
          portalItem: {
            // autocasts as new PortalItem()
            id: "308ffdb179d8436cbea544eed95b6d46"
          }
        });

        /************************************************************
         * Set the WebMap instance to the map property in a MapView.
         ************************************************************/
        const view = new MapView({
          map: webmap,
          container: "viewDiv"
        });
      });


require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/widgets/Legend",
  "esri/PopupTemplate",
  "esri/rest/support/Query",
  "esri/widgets/Home"
  ], (Map, MapView, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol, Legend, PopupTemplate, Query, Home) => {


		//declare elephant variable
		var elephant; 

		const elephantSelect = document.getElementById("list_elephants");

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

		/* Create popup template for county layer
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
*/

		// portal ID for GenX census data 
		const elephantLyr = new FeatureLayer({
			portalItem: { 
				id: "4e1b261719ca421b9555ee6eb99bab8c"
			}
			//renderer: countyRenderer,      
			//popupTemplate: template
		});  

		map.add(elephantLyr);  //displays full country

		/****************************************
		 * Pull list of unique state values from feature layer
		 * then display in sidebar panel
		 ****************************************/

		elephantLyr.when(function() {
			const elephantQry = new Query({
				where: "ElephantName is not null",
				orderByFields: ["ElephantName"],
				returnGeometry: false,
				returnDistinctValues: true,
				outFields: ["ElephantName"]
			});
			elephantLyr.queryFeatures(elephantQry).then(displayResults);
		})

		function displayResults(results) {
			const fragment = document.createDocumentFragment();
			results.features.forEach(function(elephant, index) {
				const attributes = elephant.attributes;
				const name = attributes.elephantName;

				const li = document.createElement("li");
				li.classList.add("panel-result");
				li.tabIndex = 0;
				li.setAttribute("list_elephants", index);
				li.textContent = name;

				fragment.appendChild(li);
			});
			elephantSelect.innerHTML = "";
			elephantSelect.appendChild(fragment);
		}

		/****************************************
		 * Event Listener for click on State list
		 * Zoom to extent of chosen State
		 ****************************************/

		elephantSelect.addEventListener("click", onListClickHandler);

		function onListClickHandler(event) {   
			const target = event.target;
			const resultId = target.getAttribute("list_elephants");
			const getState = target.textContent;
			console.log("user selected " + resultId + ": " + getElephant);

			if (getElephant) {
				const newElephantQuery = new Query({
					where: "elephantName = '" + getElephant + "'",
					returnGeometry: true
				});
				elephantLyr.when(() => {
					return elephantLyr.queryExtent(newElephantQuery);
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