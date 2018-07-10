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
var stateLink = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_20m.json";
var weatherLink = "https://api.weather.gov/alerts/active"
var csvPath = "data/state_funded.csv"

// function to color state based on percent funded
var getFill1 = function(state, feat){
  // console.log(feat.properties.NAME)
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      // console.log("state[i].PercentFunded not rounded = ", state[i].PercentFunded);
      // console.log("PercentFunded rounded with *100 and /100 = ", Math.round(state[i].PercentFunded * 100) / 100);
      // console.log("PercentFunded rounded without * and / = ", Math.round(state[i].PercentFunded));
      if (Math.round(state[i].PercentFunded * 100) / 100 > 95) {
        return "DarkGreen";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 90) {
        return "green";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 85) {
        return "GreenYellow";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 80) {
        return "yellow";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 75) {
        return "orange";
      }
      else if (Math.round(state[i].PercentFunded * 100) / 100 > 70) {
        return "OrangeRed";
      }
      else {
        return "red";
      }
    }
  }
}
var getFill2 = function(state, feat){
  // console.log(feat.properties.NAME)
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      // console.log("PercentOfTotalFunding not rounded = ", state[i].PercentOfTotalFunding);
      // console.log("PercentOfTotalFunding with *100 and /100 = ", Math.round(state[i].PercentOfTotalFunding * 100) / 100);
      if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 35) {
        return "Lime";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 9) {
        return "LawnGreen";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 5) {
        return "GreenYellow";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 4) {
        return "yellow";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 3) {
        return "orange";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 2) {
        return "Tomato";
      }
      else if (Math.round(state[i].PercentOfTotalFunding * 100) / 100 > 1) {
        return "OrangeRed";
      }
      else {
        return "red";
      }
    }
  }
}

var getText1 = function(state, feat){
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      return ("<h2>"+state[i].state+"</h2><hr><h3> Percentage funded by FEMA: </h3><h2>" + Math.round(state[i].PercentFunded) + "% </h2>")
    }
  }
}
var getText2 = function(state, feat){
  for(var i=0; i<state.length; i++){
    if(feat.properties.NAME == state[i].state){
      return ("<h2>"+state[i].state+"</h2><hr><h3> Percentage of all FEMA funding: </h3><h2>" + state[i].PercentOfTotalFunding + "% </h2>")
    }
  }
}

// Grabbing GeoJSON data for state borders
d3.json(stateLink, function(stateData) {
  console.log("state data = ", stateData);
  //making a callback within a callback to get the state funded data
  d3.csv(csvPath, function(fundingData) {
    // Creating a geoJSON layer with the retrieved data
    var percentFunded = L.geoJson(stateData, {
      // Style each feature
      style: function(feature) {
        return {
          color: "white",
          fillOpacity: 0.3,
          weight: 1.5,
          fillColor: getFill1(fundingData,feature)
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
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
        layer.bindPopup(getText1(fundingData, feature));
      }        
    })
  percentFunded.addTo(map);

  // adding legend here for project % funded layer
  var legend1 = L.control({ position: "bottomright"});
  legend1.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    
    // array listing out values that divide color categories (changed to ascending order)
    var limits = ["<70", 70, 75, 80, 85, 90, "95+"];
    var colors = ["red", "OrangeRed", "orange", "yellow", "GreenYellow", "green", "DarkGreen"];
    var labels = [];

    // StackOverflow method: 
    // for (var i=0; i < fundingData.length; i++) {
    //   div.innerHTML += 
    //     '<i style="background:' + getFill1(limits[i] + 1) + '"></i> ' +
    //     limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
    // }

    // add min and max
    var legend1Info = "<h1>Percent Funded</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
    div.innerHTML = legend1Info;

    limits.forEach(function(limit, index) {
      // creating html for each color in colors array
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      // I want my popups to populate with the values inside of limit
      console.log("limit = ", limit);

      // var popupBlank = "<div id=\"popup\" style=\"display: none\">number</div>"
      // labels.addEventListener("mouseover", function (event) {
      //   div.innerHTML = hover;
      // })

      // var e = document.getElementById('labels');
      // console.log(e);
      // e.onmouseover = function() {
      //   hover.style.display = 'block';
      // }
    });
    // adds html created for colors to the page's legend
    div.innerHTML += "<ul id=\"legendColors\">" + labels.join("") + "</ul>";

    // jacob says add class to legend using D3

    return div;
  }
  legend1.addTo(map);
  // getElementById only works after legend is added to map
  var e = document.getElementById("legendColors");
  // e.innerHTML += "<div id=\"popup\" style=\"display: none\">number</div>";
  
  // console.log(e.querySelectorAll("li"));
  e.querySelectorAll("li").forEach(function(currentValue, currentIndex, listObj) {
    console.log("currentValue = ", currentValue);
    console.log("currentIndex = ", currentIndex);
    console.log("listObj = ", listObj);
    currentValue.innerHTML+= "<div class=\"popup\" style=\"display: none\">number</div>";
  })
  e.onmouseover = function() {
    console.log("e = ", e);
    console.log("e2 = ", e.querySelectorAll('popup'));
    console.log("e2 = ", e.getElementsByClassName('popup'));
    e.getElementsByClassName('popup').style.display = 'block';
  }
  // var element = document.querySelector(".min");
  // console.log('element: ', element.textContent);
  // element.onmouseover(function(event){
    
  // })




  // Add variable for state layer that colors based on percentage of total funding each state gets
  var percentTotal = L.geoJson(stateData, {
    // Style each feature
    style: function(feature) {
      return {
        color: "white",
        fillOpacity: 0.3,
        weight: 1.5,
        fillColor: getFill2(fundingData,feature) //change function
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
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
      layer.bindPopup(getText2(fundingData, feature));  //change function
    }      
  })
  // not adding percentTotal to map because I don't want it displayed by default

  // add legend for percentTotal Layer
  var legend2 = L.control({ position: "bottomright"});
  legend2.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    // array listing out values that divide color categories (changed to ascending order)
    var limits = [0, 1, 2, 3, 4, 5, 9, 35];
    var colors = ["red", "OrangeRed", "Tomato", "orange", "yellow", "GreenYellow", "LawnGreen", "Lime"];
    var labels = [];

    // add min and max
    var legend2Info = "<h1>Percent of Total Funding</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
    div.innerHTML = legend2Info;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  }
  // not adding legend2 to map by default

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
          // "Street Map": streetMap, 
          "Percent Funded": percentFunded, 
          "Percent of Total Funding": percentTotal
      };
      var overlayMaps = {
          // "Percent Funded": percentFunded, 
          // "Percent of Total Funding": percentTotal, 
          "Active Weather Alerts": weatherEvents
      };

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

      map.on('baselayerchange', function (eventLayer) {
        console.log("eventLayer = ", eventLayer);
        if (eventLayer.name === 'Percent Funded') {
          map.removeControl(legend2);
          legend1.addTo(map);
          // map.removeControl(percentTotal);
          // map.removeLayer(percentTotal);
          weatherEvents.bringToFront();
        }
        else if  (eventLayer.name === 'Percent of Total Funding') {
          map.removeControl(legend1);
          legend2.addTo(map);
          weatherEvents.bringToFront();
          // add event listener for legend2
        }
      });
    })

  //     L.control.layers(baseMaps).addTo(map);
  //     L.control.layers(overlayMaps).addTo(map);
  // })
    // adding conditional to change map legend on layer change
    // activates when map layer is selected
    // map.on('overlayadd', function (eventLayer) {

    // map.on('layeradd', function(eventLayer) {
    //   weatherEvents.bringToFront();
    // });

    // activates when map layer is de-selected
    // map.on('overlayremove', function(eventLayer) {
    //   if (eventLayer.name === 'Percent Funded') {
    //     map.removeControl(legend1);
    //   }
    //   else if  (eventLayer.name === 'Percent of Total Funding') {
    //     map.removeControl(legend2);
    //   }
    // })
  })
});