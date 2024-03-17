 # Transport Systems Digital Twin

 ## Table of Contents
1. [Introduction](#introduction)
    1. [About Predictive Movement](#about-predictive-movement)
    2. [About Digital Twin](#about-digital-twin)
2. [Installation](#installation)
    1. [Docker Setup](#docker-setup)
    2. [Kubernetes Setup](#kubernetes-setup)
3. [Project Dependencies](#project-dependencies)
4. [Contributions](#contributions)

## Introduction

### [About Predictive Movement](https://predictivemovement.se/)

Predictive Movement aims to create a digital platform that will act as a collaborative hub for the transportation of people and goods with the help of Artificial Intelligence. An important driving force behind the project is to combat climate change and to reduce emissions caused by road transports.

<p align="center">
<img width="491" alt="f9ee1056-ce9f-422f-904b-eddb1d732d0b" src="https://github.com/fernand0labra/srt-digital-twin/assets/70638694/01f98d8b-d57e-47d9-a481-7747f46f3bf0">
</p>

More information regarding Predictive Movement can be found in the following videos:
> NOTE: The language of the videos is Swedish.

<table>
 <tr>
  <td>
    <a href="https://www.youtube.com/watch?v=IiRz8nRPW3s"><img width=600 src="https://github.com/fernand0labra/srt-digital-twin/assets/70638694/04a58ddf-f17d-4c2f-8c04-7377927d714f"/></a>
  </td>
  <td>
    <a href="https://www.youtube.com/watch?v=LmfDWgrOjLI"><img width=600 src="https://github.com/fernand0labra/srt-digital-twin/assets/70638694/4634e0cc-5182-45b9-8b0f-ca515ad35c4c"/></a>
  </td>
 </tr>
</table>

### About Digital Twin

This is a digital twin (agent based model) to both visualise transport data and generate new synthetic data which can be used to perform virtual experiments on transport optimizations such as systems level optimization, drone deliveries, dynamic routes in public transport, CO2 calculations, electric car adaption, scenario planning, etc.

The project has the following objectives:

1. Increase mobility in rural areas
2. Decrease the energy consumption in transport systems
3. Lower the cost for experimenting with new innovations
4. Reduce the dependencies on foreign and properiatary infrastructure
5. Maintain privacy by keeping all data locally and limiting the amount of personal data stored

More information regarding the Digital Twin can be found in the following seminar:

<p align='Center'>
 <a href="https://www.youtube.com/watch?v=rBgcNeALxgI">
  <img width=603 src="https://github.com/fernand0labra/srt-digital-twin/assets/70638694/f00e9fc8-6482-4844-9e5d-ebccdca8b379"/>
 </a> 
</p>

## Installation

This repository offers two solutions for the execution of the digital twin. The presented deployment solutions are independent and should not be performed simulatenously.

* A local setup for the simulator is offered in a Docker containarized version. 

* A server setup is offered in a scaled Kubernetes clustered version. 

Development of the local Docker version allows lower computational requirements to run the digital twin but reduces the clustering configuration provided by Kubernetes.

### [Docker Setup](https://www.docker.com/)

A local setup script is provided respectively for Linux bash ([*/docker/scripts/setup.sh*](/docker/scripts/setup.sh))and Windows powershell ([*/docker/scripts/setup.ps1*](/docker/scripts/setup.ps1)). The script depends on both Docker and [Docker Compose](https://docs.docker.com/compose/) for its correct execution. Moreover, a zip file available at the [following link](https://drive.google.com/file/d/1bO9KzSTV8_mfFRXi-5KhKnmtcVOryOby/view?usp=drive_link) should be downloaded to */docker/data/sweden-latest.osm.pbf* .

Running on a Linux OS requires setting up user permission for execution and on a Windows OS, user permission for non-proprietary script execution as shown below:

```
# User Execution Permission

chmod u+x ~/srt-digital-twin/docker/scripts/setup.sh  # Linux

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned     # Windows
```

After checking that the aforementioned requirements are installed, the script proceeds onto pulling the necessary container images. Next, the script deploys requirement and dependency containers followed by the Digital Twin simulator. 

A correct execution of the script will create a functioning web server listening on the local machine. Choosing a browser and typing 'localhost' will redirect to the visualisation of the simulator.

### [Kubernetes Setup](https://kubernetes.io/)

The kubernetes server-side setup is developed with [Skaffold](https://skaffold.dev/), an open source platform developed by Google to improve Kubernetes' synthax and allow easier deployments of higher cluster complexity. The configuration for every cluster node (e.g. image, service, port) is defined on a YAML file under the following folders:

* The cluster requirements (e.g. certificate manager, ingress controller, etc.) are provided under [*/k8s/reqs/*](/k8s/reqs/).
* The cluster dependencies are provided under [*/k8s/deps/*](/k8s/deps/).
* The cluster Digital Twin can also be deployed and is provided under [*/k8s/base/*](/k8s/base/).

The following command needs to run for starting the skaffold platform. The command should be run on the locations where the *skaffold.yaml* is available. This file contains extra configuration steps for the conjunct build and deployment of the cluster.

```
# Installation for Linux x86_64 (amd64)

curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
sudo install skaffold /usr/local/bin/

---

skaffold run  # Initiate Configuration Parsing
```

## Project Dependencies

The project relias on a set of dependencies for the obtention of geolocation data, public transport lines and routes with driving duration.

### Geolocation Data

#### [Pelias Geocoder](https://github.com/pelias/pelias)

Pelias is a search engine for places worldwide, powered by open data. It turns addresses and place names into geographic coordinates, and turns geographic coordinates into places and addresses. 

The software imports data from [Lantmäteriet](https://www.lantmateriet.se/en/about-lantmateriet/), a swedish authority that i.a. makes geodata from Sweden available. The data can be however substituted by any CSV file with the same format as the downloaded counterpart.

#### [Open Street Map (OSM)](https://www.openstreetmap.org/)

OSM is an initiative to create and provide free geographic data, such as street maps, to anyone. The data is used by OSRM routing engine to find the best route for the vehicles.

### Public Transport

#### [General Transit Feed Specification (GTFS) Data](https://gtfs.org/)

GTFS is an Open Standard used to distribute relevant information about transit systems to riders. It allows public transit agencies to publish their transit data in a format that can be consumed by a wide variety of software applications. GTFS consists of two main parts: 
* **GTFS Schedule** contains information about routes, schedules, fares, and geographic transit details.
* **GTFS Realtime** contains trip updates, vehicle positions, and service alerts.

The data is imported from [Trafiklab](https://www.trafiklab.se/about/), a service developed and managed by [Samtrafiken](https://samtrafiken.se/about-us/) that provides API access to the regional public transport data of Sweden.

### Routing Software

#### [Open Source Routing Machine (OSRM)](https://github.com/Project-OSRM/osrm-backend)

OSRM is a high performance routing engine designed to run on OpenStreetMap data. The software finds the best routes and drive durations on the road network between two geopoints.

#### [Vehicle Routing Open-source Optimization Machine (VROOM)](https://github.com/VROOM-Project/vroom)

VROOM is a vehicle routing engine that extends OSRM by choosing the vehicles and shipments that optimize duration or distance. The software includes (1) Vehicles, (2) Jobs and (3) Shipments to model the best route by considering each as:

1. A description of resources. 
2. Single-location pickup and/or delivery tasks
3. Pickup-and-delivery tasks that should happen within the same route.

#### [Open Trip Planner (OTP)](https://github.com/opentripplanner/OpenTripPlanner)

OTP is an open source trip planner, focusing on travel by scheduled public transportation in combination with bicycling, walking, and other mobility services. 

The software builds its representation of the transportation network from open data in open standard file formats (primarily GTFS and OpenStreetMap). OTP applies real-time updates and alerts with immediate visibility to clients, finding itineraries that account for disruptions and service changes.

### Others

#### [Elasticsearch Engine](https://github.com/elastic/elasticsearch)

Elasticsearch is a distributed search and analytics engine optimized for speed and relevance on production-scale workloads. The software is used to gather realtime statistics of the simulation, which can be seen through [Kibana](https://github.com/elastic/kibana), a browser-based dashboard.

#### [OpenMapTiles (OMT)](https://github.com/openmaptiles/openmaptiles)

OMT is an extensible and open tile schema based on the OpenStreetMap. This project is used to generate vector tiles for online zoomable maps. The visualisation module does not currently use OMT; instead the 3D vector relies on [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/guides/), a client-side JavaScript library for building web maps.

A Mapbox access token should be generated after creating a [Mapbox account](https://www.mapbox.com). Once the token has been obtained, it needs to be placed in [*packages/visualisation/.env*](packages/visualisation/.env) with key name **VITE_MAPBOX_ACCESS_TOKEN**.

> NOTE: If you lack a Mapbox Access token or there is something wrong with it, you can still access the visualisation in a browser but the background will be a solid gray instead of a map.

## Contributions

This code is released as open source, you can create your own copy of this to use within your own fleet if you want to. You can also contribute by sending Pull Requests or issues to us and we will review and merge them. 

If you want to receive a closed source license, please contact Christian Landgren at Iteam.

- `main` :: protected branch that requires PR:s to be changed (automatically synced with CI environment).
- `Releases` :: automatically built and pushed to prod when approved.

Predictive Movement is free and open source software [licensed by Iteam Solutions AB](LICENSE).

<p align="center">
<img alt="ad87b383-be1e-4447-94b4-f5c8c0986cd8" src="https://github.com/fernand0labra/srt-digital-twin/assets/70638694/ccfd2b14-abd2-4823-b7e1-9ba99b8f8a84">
</p>
