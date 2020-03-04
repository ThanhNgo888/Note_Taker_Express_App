// Dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");
const HTMLroutes = require('./routes/htmlRoutes');
const APIroutes = require('./routes/apiRoutes');

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3000;

//===================================================================================

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// ===============================================================================
app.use(HTMLroutes);
app.use(APIroutes);


// LISTENER
app.listen(PORT, function() {
  console.log("Listening on PORT: " + PORT);
});

