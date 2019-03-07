// function parseCommas(number){
//   numberMod = number.replace(",","")
//   numberMod = number.replace("$","")
//   return parseInt(numberMod)
// }


Plotly.d3.csv("state_funded.csv", function(error, response) {

  console.log('RESPONSE:', response);

  var labels_list = [];
  var values_list = [];

  for (var i = 0; i < response.length; i++) {
    labels_list.push(response[i].Region)
    // values_list.push(parseCommas(response[i].FEMA_Funded))
    values_list.push(response[i].FEMA_Funded_Int)
  };

  console.log('labels_list: ', labels_list);
  console.log('values_list: ', values_list);


  console.log('values_list_int: ', values_list);


  var trace1 = {
    labels: labels_list,
    values: values_list,
    type: 'pie'
  };


  var data = [trace1];

  var layout = {
    title: "Portion of FEMA Funding by Region",
    height: 400,
    width: 500
  };


  // var layout = {
  //   title: "FEMA $ Funded for Each Disaster Type (2008-2018)",
  //   xaxis: {
  //     title: "Disaster Type"
  //   },
  //   yaxis: {
  //     title: "$ Funded by FEMA"
  //   }
  // };

  Plotly.newPlot("plot", data, layout);
});







