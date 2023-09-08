const public_key = 'BM8TS8LROkfyBsbGvSE8z7BjYZyNkgyxI_x7T6b22qDbKkWYK4Up9ljpYtA6n7kZzqsuQMuL2eRP6Bb0Oq0NYP4'

//  install event
self.addEventListener("install", (evt) => {
  console.log("Service worker has been installed");
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("Service worker has been activated!");
});

//fetch event handler
self.addEventListener("fetch", (evt) => {
  let request = evt.request;

  evt.respondWith(
    caches
      .match(request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(request).then((fetchRes) => {
              // For other requests, don't cache them
              return fetchRes;
          })
        );
      })
      .catch(() => {
        console.log("Failed to fetch!");
      })
  );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'subscribeUser') {
      // Function to subscribe the user for push notifications
      const subscribeUser = () => {
          return self.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: public_key,
          });
      }
  
      // Subscribe the user
      subscribeUser()
        .then((subscription) => {
          console.log('User subscribed:', subscription);
        })
        .catch((error) => {
          console.error('Failed to subscribe user:', error);
        });
    }
});

function showNotification(title, message) {
    // Send a push notification
    self.registration.showNotification(title, {
      body: message,
      icon: 'vite.svg', // Path to the notification icon
    });
}  

setInterval(() => {
  showNotification("Hello", "From Service worker")
}, 1 * 60 * 1000);