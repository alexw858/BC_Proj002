
Plotly.d3.csv("incident_funded.csv", function(error, response) {

  console.log(response);

  var x_value_list = [];
  var y_value_list = [];

  for (var i = 0; i < response.length; i++) {
    x_value_list.push(response[i].incidentType)
    y_value_list.push(response[i].FEMA_Funded)
  };

  var trace1 = {
    x: x_value_list,
    y: y_value_list,
    type: "bar"
  };

  var data = [trace1];

  var layout = {
    title: "FEMA $ Funded for Each Disaster Type (2008-2018)",
    xaxis: {
      title: "Disaster Type"
    },
    yaxis: {
      title: "$ Funded by FEMA"
    }
  };

  Plotly.newPlot("plot", data, layout);
});







