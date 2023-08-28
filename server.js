const express = require('express')

// express app
const app = express();

app.use(express.static(__dirname))

app.listen(3000, () => {
    console.log("Listing on port 4000!!!");
  });