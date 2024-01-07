import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'; // to color output messages
import users from './data/usersSeed.js';
import products from './data/productsSeed.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

// ----- How process.argv works -----
// console.log(process.argv);
// ----- Terminal -----
// node server/seeder
// Output
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\mklava\\Documents\\js_course\\mern-course\\proshop\\server\\seeder'
// ]
// ----- Terminal -----
// node server/seeder -d
// Output
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\mklava\\Documents\\js_course\\mern-course\\proshop\\server\\seeder',
//   '-d',
// ];
// console.log(process.argv[2]);
// ----- Terminal -----
// node server/seeder -d
// Output
// -d

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany(); // deletes everything if there are no arguments
    await Product.deleteMany(); // deletes everything if there are no arguments
    await User.deleteMany(); // deletes everything if there are no arguments

    const createUsers = await User.insertMany(users);
    const adminUser = createUsers[0]._id; // get id of adminUser (first in users list)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }; // create new product list with admin id inserted as user id
    });
    await Product.insertMany(sampleProducts);
    console.log('Data Imported!'.green.inverse); // can be used because colors is imported in the file, weird syntax
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany(); // deletes everything if there are no arguments
    await Product.deleteMany(); // deletes everything if there are no arguments
    await User.deleteMany(); // deletes everything if there are no arguments
    console.log('Data Destroyed successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

// ----- package.json scripts-----
// "data:import": "node server/seeder.js",
// "data:destroy": "node server/seeder.js -d"

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
