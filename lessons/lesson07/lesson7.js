

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/layers/GraphicsLayer",
  "esri/rest/support/Query",
  "esri/widgets/Search"
], (Map, MapView, FeatureLayer, Graphic, SimpleMarkerSymbol, GraphicsLayer, Query, Search) => {

  const farms = 500;
  const pop = 25000;
  const popdens = 150;
  const crime = 0.02;
  const univ = 1;

  const cntyWhere = "NO_FARMS87 > " + farms + " AND AGE_18_64 > " + pop + " AND POP_SQMILE < " + popdens;
  const cityWhere = "CRIME_INDE <= " + crime + " AND UNIVERSITY = " + univ;

  const map = new Map({
    basemap: "dark-gray-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 7,
    center: [-78, 41]
  });

  const searchWidget = new Search({
  	view: view
  });

  //Add the search widget to the top right corner of the view
  view.ui.add(searchWidget, {
  	position: "top-right"
  });
  
  const counties = new FeatureLayer({
    portalItem: {
      id: "0875e77a2ff54dd689e169d7798d0905"
    }
  });
  
  const cities = new FeatureLayer({
    portalItem: {
      id: "5af96a04ef4c4d8a9bb2a9dd2c883e36"
    }
  });

  const resultsLayer = new GraphicsLayer();
  
  map.addMany([counties, cities, resultsLayer]);

  const cntyQuery = new Query({
    where: cntyWhere,
    returnGeometry: true,
  });
  
  counties.when(function() {
    cities.when(function() {
      return counties.queryFeatures(cntyQuery);
    }).then(findGoodCities);
  });

  function findGoodCities(goodCounties) {
    console.log("The cities meeting your criteria are:");
    goodCounties.features.forEach(function(county) {
      const cityQuery = new Query({
      where: cityWhere,
      geometry: county.geometry,
      returnGeometry: true,
      spatialRelationship: "intersects",
      outFields: ["NAME"]
    });
    
      cities.queryFeatures(cityQuery).then(function(result){displayResults(result,true)});      
    });      
  }
  
  function displayResults(results) {
    const cityFeatures = results.features.map(function(graphic) {
      graphic.symbol = new SimpleMarkerSymbol({
        color: "yellow"
      });      
      console.log(graphic.attributes.NAME) 
      return graphic;
    });
    resultsLayer.addMany(cityFeatures);
  }  
  
});

