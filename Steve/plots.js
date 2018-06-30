// function buildChart(error, response) {
//   x_value_list = [];
//   y_value_list = [];
//   for (var i = 0; i < response.length; i++) {
//     x_value_list.push(response.disaster_type)
//     y_value_list.push(response.funding_percent)
//   };

//   var trace1 = {
//     x: x_value_list,
//     y: y_value_list,
//     type: "bar"
//   };

//   // var trace2 = {  }

//   var data = {trace1};

//   var layout = {
//     title: "Disaster Chart",
//     xaxis: {
//       title: "Disaster Type"
//     },
//     yaxis: {
//       title: "% Funded by FEMA"
//     }
//   };

//   Plotly.newPlot("plot", data, layout);

// };

// function getData() {

//   Plotly.d3.csv("Summary_Plotly.csv", buildChart(error, response))
//
Plotly.d3.csv("incident_funded.csv", function(error, response) {

  console.log(response);

  var x_value_list = [];
  var y_value_list = [];

  for (var i = 0; i < response.length; i++) {
    x_value_list.push(response[i].incidentType)
    y_value_list.push(response[i].PercentFunded)
  };

  var trace1 = {
    x: x_value_list,
    y: y_value_list,
    type: "bar"
  };

  // console.group("value list:")
  // console.log(x_value_list);
  // console.log(y_value_list);
  // console.groupEnd();

  // var trace2 = {  }

  var data = [trace1];

  var layout = {
    title: "FEMA % Funded for Each Disaster Type",
    xaxis: {
      title: "Disaster Type"
    },
    yaxis: {
      title: "% Funded by FEMA"
    }
  };

  Plotly.newPlot("plot", data, layout);
})
// };

// getData();





