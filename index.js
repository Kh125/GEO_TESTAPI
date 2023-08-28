function initMap() {
  // initialize services
  const service = new google.maps.DistanceMatrixService();
  // build request
  const destination = { lat: 16.85632194327489, lng: 96.13532769296184 };  //UIT Location
  
  getCurrentLocation()
    .then((location) => {
      console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
      
      const currentLocation = new google.maps.LatLng(location.latitude, location.longitude);
      
      // fake location
      // const currentLocation = {lat: 16.85020110378098, lng: 96.19659775068266 }

      const request = {
        origins: [currentLocation],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING, // public transportation
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      
      // get distance matrix response
      service.getDistanceMatrix(request).then((response) => {
        // put response
        var distance, duration = undefined  
    
        var response = JSON.parse(JSON.stringify(response));

        // get duration and distance
        var rows = response.rows[0].elements[0];
    
        if(rows.status === 'OK') {
          distance = (rows.distance.value/1000).toFixed(2);
          duration = rows.duration.value;
    
          // convert to hours, minutes, seconds
          var [hours, minutes, seconds] = calculateDuration(duration)
          console.log(distance, hours, minutes, seconds)
        }
    
        document.getElementById("message").innerText = `It will takes ${hours}:${minutes}:${seconds} to reach to your destination.`
      })
    })
    .catch((error) => {
      console.error(error);
    })
}

const calculateDuration = (sec) => {
  // Calculate hours, minutes, and seconds
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor((sec % 3600) / 60);
  var seconds = sec % 60;

  return [hours, minutes, seconds]
}

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if the Geolocation API is available in the browser
    if ("geolocation" in navigator) {
      // Get the current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Resolve the Promise with the location data
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        }
      );
    } else {
      const errorMessage = "Geolocation is not available in this browser.";
      console.error(errorMessage);
      reject(errorMessage);
    }
  });
};

window.initMap = initMap;