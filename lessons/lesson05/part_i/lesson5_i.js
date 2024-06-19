
/**************************************************************************** 
 * GEOG863 - Lesson 5, Part I - Bernadette Williams
 * 3D Map Scene of Texas Department of Transportation Vector Tile Basemap
 * Created: 19 June 2024
 ****************************************************************************/

require(["esri/Map", "esri/views/SceneView", "esri/WebScene", "esri/layers/VectorTileLayer"], (
    Map,
    SceneView,
    WebScene,
    VectorTileLayer) => {

    // Create a Map - this is resulting in an underlying basemap?
    const map = new Map({
        basemap: "dark-gray-vector"
    });


    // Make 3D scene view and bind it to the map
    // Center on Houston, Texas
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        center: [-95.3656, 29.7607],
        zoom: 10
    });

    /********************************************************************
     * Add the TxDOT vector tile layer to the map
     *
     *********************************************************************/
    const tileLayer = new VectorTileLayer({
        url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer"
    });

    map.add(tileLayer);

    view.when(function() {
        // when the scene and view resolve, display the scene's
        // title in the DOM
        const title = "Assignment 5.1: Texas Department of Transportation Vector Tile Layer";
        titleDiv.innerHTML = title;
    });
});