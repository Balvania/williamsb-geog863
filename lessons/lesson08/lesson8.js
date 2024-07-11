
/**************************************************************************** 
 * GEOG863 - Lesson 8 - Bernadette Williams
 * Generational Demographics of the United States 
 * % Population of Gen X by county
 * EXPANDED UI
 * - add collapsing sidebar with state links
 * 
 * 
 * Created: 3 July 2024
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

	  //capture user input - get rid of this
	  //let state = prompt("Enter a State abbreviation to view Gen X % population by county", "example: AK");




	  //verify user input has been captured in state variable
	  //console.log("The user entered " + state);

	  //declare state variable
	  var state; //needed?

	  //const listNode = document.getElementById("list_states");

	  var queryStates = document.getElementById("query_states"); //this was a button, needed?

	  //create query statement
	  //const stateWhere = "ST_ABBREV = " + stateSelect;


	  const map = new Map({
	    basemap: "dark-gray-vector",
	    ground: "world-elevation"
	  });

	  const view = new MapView({
	    container: "viewDiv",
	    map: map,
	    center: [-105, 50],  
	    zoom: 3
	  });

      const homeBtn = new Home({
          view: view
      });

      // Add the home button to the top left corner of the view
      view.ui.add(homeBtn, "top-left");


	  const stateSelect = document.getElementById("list_states");




	/*Generational data fields:
	  OLDRGENSCY - Silent & Greatest Generations (born 1945 or earlier)
	  BABYBOOMCY - Baby Boomer (born 1946 to 1964)
	  GENX_CY - Generation X (born 1965 to 1980)
	  MILLENN_CY - Millennial (born 1981 to 1998)
	  GENZ_CY - Generation Z (born 1999 to 2016)
	  GENALPHACY - Generation Alpha (born 2017 or later)
	*/

	// Create popup template
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


	  //add basic query for state abbreviation selected by user
	  //updated portal ID for GenX census data 
	  const countyLyr = new FeatureLayer({
	    portalItem: { 
	      id: "959588e62d854f588b3ae97c0c86f890"
	    },
	    //remove this, no user input  yet
	//    definitionExpression: "ST_ABBREV = '" + state + "'",
	    renderer: countyRenderer,      
	    popupTemplate: template
	  });  
	  

	  map.add(countyLyr);  //this should now display the entire country I think
	  console.log("the map of the full country should now be displayed.");

	  //query county layer
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
	  //	.then(getValues)
	  //	.then(getUniqueValues)
	  //		.then(displayResults);
	  //	.then(addToSelect)
	  //	.then(createBuffer);

	/*/return an array of all the values in the ST_ABBREV field of the county layer
	function getValues(response) {
		var features = response.features;
		var values = features.map(function (feature) {
			return features.attributes.ST_ABBREV;
		});
		console.log("The getValues function returned " + values);
		return values;
	}

	//return an array of unique values in the ST_ABBREV field of the county layer
	function getUniqueValues(values) {
		var uniqueValues = [];

		values.forEach(function (item, i) {
			if (
				(uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
				item !== ""
			) {
				uniqueValues.push(item);
			}
		});
		console.log("The getUniqueValues function returned " + uniqueValues)
		return uniqueValues;
	} */

	//display a list of states using document fragment - WORKING FINALLY
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



	/* HOLD ON THIS
	// add the unique values to the list of States
	function addToSelect(values) {
		values.sort();
		values.forEach(function (value) {
			var option = document.createElement("option");
			option.text = value;
			stateSelect.add(option);
		});
		return setStateDefinitionExpression(stateSelect.value);
	}

	// set the definition expression on the county layer to reflect 
	// the selection of the user
	function setStateDefinitionExpression(newValue) {
		countyLyr.definitionExpression = "ST_ABBREV = '" + newValue + "'";

		if (!countyLyr.visible) {
			countyLyr.visible = true;
		}

		return getStateExtent();
	}

	// zoom to extent of user selected state
	function getStateExtent() {
		var stateQuery = countyLyr.createQuery();

		return countyLyr.queryExtent(stateQuery).then((response) =>
			{
				view.goTo(response.extent);
			});
	}
	*/

	/*** I don't think I need this
	 *  get all the geometries of the county layer
	// the createQuery() method creates a query
	// object that respects the definitionExpression of the layer
	function queryForStateGeometries() {
		var stateQuery = countyLyr.createQuery();

		return countyLyr.queryFeatures(stateQuery).then(function (response) {
			stateGeometries = response.features.map(function (feature) {
				return feature.geometry;
			});

			return stateGeometries;
		});
	}  **/

	//set a new definition expression on the county layer
	// and add zoom to extent of user's State selection
	stateSelect.addEventListener("change", function() {
		var type = event.target.value;
		setStateDefinitionExpression(type).then()
	})

	stateSelect.addEventListener("click", onListClickHandler);

	function onListClickHandler(event) {   
	    const target = event.target;
	    const resultId = target.getAttribute("list_states");
	    const getState = target.textContent;
	   // const stateChoice = target.getAttribute("ST_ABBREV");
	    console.log("user selected " + resultId + ": " + getState);

	   	// don't know if I need this
	   	const result = resultId[parseInt(resultId, 10)];
	   	console.log("result value is " + result);

	    if (getState) {
	    	console.log("made it here - result is true");
	    	map.removeAllLayers();
	    	const newCountyLayer = new FeatureLayer({
	    		portalItem: { 
	      			id: "959588e62d854f588b3ae97c0c86f890"
	    		},
				definitionExpression: "ST_ABBREV = '" + getState + "'",
	    		renderer: countyRenderer,      
	    		popupTemplate: template
	  		}); 

/*
	    	const newStateQuery = new Query({
	    		where: "ST_ABBREV = '" + getState + "'",
	    		returnGeometry: true
	    	});
*/

	    	console.log("getState value is " + getState);
	    	newCountyLyr.when(() => {
	    		return newCountyLyr.queryExtent();
	    	})
	    	.then((response) => {
	    		view.goTo(response.extent);
	    	});
	    }
	};

	  const countyLyr = new FeatureLayer({
	    portalItem: { 
	      id: "959588e62d854f588b3ae97c0c86f890"
	    },
	    //remove this, no user input  yet
	//    definitionExpression: "ST_ABBREV = '" + state + "'",
	    renderer: countyRenderer,      
	    popupTemplate: template
	  });  


	  //after layer is loaded, add zoom to extent of user's State selection
	  /*countyLyr.when(() => 
	  {
	    return countyLyr.queryExtent();
	  })
	  .then((response) => 
	  {
	    view.goTo(response.extent);
	  }); **/
	  
	  const legend = new Legend({
	    view: view,
	    layerInfos: [{
	      layer: countyLyr,
	      title: "Gen X Population by County (born 1965 to 1980)"
	    }]
	  });

	  view.ui.add(legend, "bottom-left");  
  
});
