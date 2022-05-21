// ArcGIS libraries use AMD format.  To use the libraries, 
// we specify a list of modules (e.g. Map, MapView) in a list
// with the require.  The second parameter defines a function
// that will use these modules.  We specify the module names
// in order in the function parameter list.  When this javascript
// file is loaded by the html, it will run this function using these
// modules.

// Read more here: https://dojotoolkit.org/documentation/tutorials/1.10/modules/index.html

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend"	
  ], function(Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend) {

        // Create a basemap for the map view
        const myMap = new Map({
          basemap: "streets" // Basemap layer service
        });


        // Create a map view for the HTML using the basemap
        // previously created.
        const myView = new MapView({
          container: "viewDiv", // Div element 
          map: myMap,
          center: [-111.7924, 43.8231], // Longitude, latitude
          zoom: 14 // Zoom level
        });


        // Create a Graphics Layer which can be used to draw graphics
        // on the map
        var graphicsLayer = new GraphicsLayer();
        myMap.add(graphicsLayer);

        // Create a locate me button        
        var locate = new Locate({
            view: myView,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
                options.target.scale = 1000;  // 1/1000 scale
                return view.goTo(options.target);
              }
        });
        myView.ui.add(locate, "top-left");

        // Create a Search Bar
               
        var search = new Search({
            view: myView
        });
        myView.ui.add(search, "top-right"); 

        // Create a Plot location button

        var locMarker = document.createElement('div');
        locMarker.style.width = 200;
        locMarker.style.height = 150;
        locMarker.style.backgroundColor  = "rgb(200, 200, 200)";
        locMarker.className = "esri-widget--button esri-widget esri-interactive home";
        locMarker.innerHTML = "Plot location";
        locMarker.addEventListener("click", markLocation);
        myView.ui.add(locMarker, "bottom-left"); 

  function markLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(addMarker);
    }
  }

  function addMarker(position){
    // Create a marker
    // This JS map is expected by ArcGIS to make a graphic                 
    var marker = {
        type: "simple-marker",
        style: "circle",
        color: [0,0,255] 
    };
    
    // Define location to draw
    // This JS map is expected by ArcGIS to make a graphic
    var location = {
        type: "point",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    
    // Define attributes for use in popup template.  The popup
    // template uses {}'s to access items in the attributes map.
    // The template content also supports HTML tags.
    var popup_attributes = {
        timestamp: new Date().toLocaleString(),
    }
    
    var popup_template = {
        title: "Location Point",
        content: "<br>Timestamp</b>: {timestamp}"
    }
    
    // Combine location and symbol to create a graphic object
    // Also include the attributes and template for popup
    var graphic = new Graphic({
        geometry: location,
        symbol: marker,
        attributes: popup_attributes,
        popupTemplate: popup_template
    });
    
    // Add the graphic (with its popup) to the graphics layer
    graphicsLayer.add(graphic);
  }
});
