# US-Disaster-Relief-Mapper

## Project Overview

A web application was created using machine learning to train a model on predicting neuron types based on firing characteristics.  The data was aquired from [NeuroElectro](https://www.neuroelectro.org/) and was used to train a Gradient Boosting model from the scikit-learn library.  After training the model on 80% of the data (filtered down to the top 6 firing characteristics with the most data), it predicted the correct neuron type with 86% accuracy.

A Heroku web application was created with this model and can be accessed here: [Neuron Predictor](https://neuron-pred.herokuapp.com/)

Setup a local http server
<p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/setup_http_server.png" width="500"/>
 </p>

Visit the url in your favorite web browser
<p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/visit_url.png" width="500"/>
 </p>

The landing page
<p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/landing_page.png" width="500"/>
 </p>

 Clicking on a state brings up a popup with information
 <p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/state_popup.png" width="500"/>
 </p>

  Clicking on a weather event brings up a popup with information
 <p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/weather_popup.png" width="500"/>
 </p>

Selecting the Percent of Total Funding option on the Leaflet controller in the top right changes the map
 <p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/percent_total_funding_map.png" width="500"/>
 </p>
 
 The popups also reflect the new information for Percent of Total Funding
 <p align="left"> 
  <img src="https://github.com/alexw858/BC_Proj002/blob/alexBranch/screenshots/percent_total_funding_popup.png" width="500"/>
 </p>