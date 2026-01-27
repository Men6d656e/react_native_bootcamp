import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

// We provide a very long timeout (120s) for the fresh download
beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    binary: {
      version: "6.0.11"
    }
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}, 600000);


afterAll(async () => {
  // Only try to disconnect if a connection exists
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  // Only stop mongo if it was actually created
  if (mongo) {
    await mongo.stop();
  }
}, 120000);




// "scripts": {
//   "test": "MONGOMS_DOWNLOAD_DIR=./mongodb_bin node --experimental-vm-modules node_modules/jest/bin/jest.js"
// }