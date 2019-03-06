// Creating map object
var map = L.map("map", {
  center:[37.09, -95.71], 
  zoom: 4
});

// Adding tile layer
var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  accessToken: api_key,
  id: 'mapbox.streets',
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(map);

// because this is a http link and not https, need to disable chrome web security with allow-control-allow-origin plugin
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en
// var stateLink = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_20m.json";
var statePath = "US_states_geojson.json"
var weatherLink = "https://api.weather.gov/alerts/active"
var csvPath = "data/state_funded.csv"

// function to color state based on percent funded
var getFill = function(state, feat){
  console.log(feat.properties.NAME)
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      // console.log(state[i].PercentFunded)
      console.log(Math.round(state[i].PercentFunded * 100) / 100)
      if (Math.round(state[i].PercentFunded * 100) / 100 > 0.95) {
        return "DarkGreen";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 0.90) {
        return "green";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 0.85) {
        return "GreenYellow";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 0.80) {
        return "yellow";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 0.75) {
        return "orange";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 0.70) {
        return "OrangeRed";
      }
      else {
        return "red";
      }
    }
  }
}

var getText = function(state, feat){
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      return ("<h2>"+state[i].state+"</h2><hr><h3> Percentage funded by FEMA: </h3><h2>" + Math.round(state[i].PercentFunded * 100) + "% </h2>")
    }
  }
}


// Grabbing GeoJSON data for state borders
d3.json(statePath, function(stateData) {
  console.log("state data = ", stateData);
  //making a callback within a callback to get the state funded data
  d3.csv(csvPath, function(fundingData) {
    // console.log("funding data = ", fundingData);

    // Creating a geoJSON layer with the retrieved data
    var stateBorders = L.geoJson(stateData, {
      // Style each feature
      style: function(feature) {
        return {
          color: "white",
          fillOpacity: 0.3,
          weight: 1.5,
          fillColor: getFill(fundingData,feature)
        };
      },
        // Called on each feature
      onEachFeature: function(feature, layer) {
        // console.log("funding data = ", fundingData);
          // Set mouse events to change map styling
        layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 50% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 30%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.3
            });
          }
        });
        // I need to loop through fundingData to gather the percentages for the pop-up, created function getText to gather the percentages
        layer.bindPopup(getText(fundingData, feature));
      }
        
    })
  stateBorders.addTo(map);

  // add next d3.json call to the active weather api
  d3.json(weatherLink, function(weatherData) {
    console.log("weather data = ", weatherData);
    function severityColor(severity) {
      if (severity === "Minor") {
        return "green";
      }
      else if (severity === "Moderate") {
        return "yellow"
      }
      else if (severity === "Severe") {
        return "red"
      }
      else {
        return "blue";
      }
    }
    var weatherEvents = L.geoJson(weatherData, {
      style: function(feature) {
        return {
          color: severityColor(feature.properties.severity),
          fillOpacity: 0.6,
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
        layer.bindPopup("<h3>" + feature.properties.event + "</h3><br><p> Severity: " + feature.properties.severity + "</p");
      }
    })

    weatherEvents.addTo(map);


    var baseMaps = {
        "Street Map": streetMap
    };
    var overlayMaps = {
        "State Borders": stateBorders, 
        "Active Weather Alerts": weatherEvents
    };

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  })
})
});
