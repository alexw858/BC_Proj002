// Creating map object
var map = L.map("map", {
    center:[37.09, -95.71], 
    zoom: 4
});

// Adding tile layer
var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiYWxleHc4NTgiLCJhIjoiY2ppZHY5Y3k3MDJ3MjNrbXc3c3g5Z2dzeSJ9.8I2wrPN9T9Otrtj92m6kbg',
        id: 'mapbox.streets',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(map);

// because this is a http link and not https, need to disable chrome web security with allow-control-allow-origin plugin
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en
var stateLink = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_20m.json";
var weatherLink = "https://api.weather.gov/alerts/active"


// Grabbing GeoJSON data for state borders
d3.json(stateLink, function(stateData) {
    console.log("state data = ", stateData);
    // Creating a geoJSON layer with the retrieved data
    var stateBorders = L.geoJson(stateData, {
      // Style each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "white",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        //   fillColor: chooseColor(feature.properties.borough),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          }
        });
        layer.bindPopup("<h3>" + feature.properties.NAME + "</h3>");

    }
  })

  
  stateBorders.addTo(map);
  // add next d3.json call to the active weather api
  var baseMaps = {
      "Street Map": streetMap
  };
  var overlayMaps = {
      "State Borders": stateBorders
  };

   L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(map);
});
