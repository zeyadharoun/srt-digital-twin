 # Transport Systems Digital Twin

 ## Table of Contents
1. [Introduction](#introduction)
    1. [About Predictive Movement](#about-predictive-movement)
    2. [About Digital Twin](#about-digital-twin)
2. [Installation](#installation)
    1. [Docker Setup](#docker-setup)
    2. [Kubernetes Setup](#kubernetes-setup)
3. [Project Dependencies](#configuration-dependencies)
4. [Contributions](#contributions)

## Introduction

### [About Predictive Movement](https://predictivemovement.se/)

Predictive Movement aims to create a digital platform that will act as a collaborative hub for the transportation of people and goods with the help of Artificial Intelligence. An important driving force behind the project is to combat climate change and to reduce emissions caused by road transports.

More information regarding Predictive Movement can be found in the following videos:

// Insert Explanatory Videos

### About Digital Twin

This is a digital twin (agent based model) to both visualise transport data and generate new synthetic data which can be used to perform virtual experiments on transport optimizations such as systems level optimization, drone deliveries, dynamic routes in public transport, CO2 calculations, electric car adaption, scenario planning, etc.

The project has the following objectives:

1. Increase mobility in rural areas
2. Decrease the energy consumption in transport systems
3. Lower the cost for experimenting with new innovations
4. Reduce the dependencies on foreign and properiatary infrastructure
5. Maintain privacy by keeping all data locally and limiting the amount of personal data stored

More information regarding the Digital Twin can be found in the following seminar:

// Insert Digital Twin Seminar

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

* The cluster requirements (e.g. namespaces, certificate manager, ingress controller, etc.) are provided under [*/k8s/reqs/*](/k8s/reqs/).
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

The project relias on a set of dependencies for the obtention of GPS data, public transport lines and routes with their respective driving duration. In the following subsections, an explanation on the tool and use of the dependency is given.

### GPS Data

#### [Pelias Geocoder](https://github.com/pelias/pelias)

Pelias is a search engine for places worldwide, powered by open data. It turns addresses and place names into geographic coordinates, and turns geographic coordinates into places and addresses. The software imports data from [Lantmäteriet](https://www.lantmateriet.se/en/about-lantmateriet/), a swedish authority that i.a. makes geodata available in society. The data can be however substituted by any CSV file with the same format as the downloaded counterpart.

#### General Transit Feed Specification (GTFS) Data

GTFS-data from [Trafiklab](https://developer.trafiklab.se/)

### Public Transport

### Routing Software

#### Open Source Routing Machine (OSRM)

A routing software to find best routes and drive duration on the road network between two geopoints. Imports sweden data.

#### [Vehicle Routing Open-source Optimization Machine (VROOM)](https://github.com/VROOM-Project/vroom)

VROOM is a vehicle routing engine that extends OSRM by choosing the vehicles and shipments that optimize duration or distance. The software includes (1) Vehicles, (2) Jobs and (3) Shipments to model the best route by considering each as:

1. A description of resources. 
2. Single-location pickup and/or delivery tasks
3. Pickup-and-delivery tasks that should happen within the same route.

#### Open Trip Planner (OTP)
Finding the fastest route between two points in the public transport network. Imports GTFS data from

### Others

#### Elasticsearch Engine

This is used to gather realtime statistics.

#### Kibana

This is used to gather realtime statistics.

#### OpenTiles

Self hosted tiles server to provide 3d vector maps.


There is a shared Mapbox Access token inside `packages/visualisation/.env`. If you want to use your own token you will need to generate a new one.

1. Go to (https://www.mapbox.com)[https://www.mapbox.com] and login or create an account.
2. Go to (https://account.mapbox.com)[https://account.mapbox.com] and create an Access token.
3. Copy the generated token to your clipboard.
4. Open the `packages/visualisation/.env` file.
5. Replace the token on the line starting with `VITE_MAPBOX_ACCESS_TOKEN=`.

> NOTE: if you lack a Mapbox Access token or if there is something wrong with it, you can still access the visualisation in a browser but the background will be a solid gray instead of a map.

## Contributions

This code is released as open source - which means you can create your own copy of this to use within your own fleet if you want to. You can also contribute by sending Pull Requests or issues to us and we will review and merge them. 

If you want to receive a closed source license, please contact Christian Landgren at Iteam.

- `main` — is a protected branch and requires PR:s to be changed, this is automatically synced with CI environment.
- `Releases` - To push a new release - create a new Release in the Github UI and when published, a new build will automatically be pushed to prod.

Predictive Movement is free and open source software [licensed by Iteam Solutions AB](LICENSE).