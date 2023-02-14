
const mongoose = require('mongoose');


const connectDB = async (url) => {

    try {
        // Connect to the MongoDB cluster
         mongoose.connect(
          url,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => console.log(" Mongoose is connected")
        );
    
      } catch (e) {
        console.log("could not connect");
      }
    
    
}


module.exports = connectDB;