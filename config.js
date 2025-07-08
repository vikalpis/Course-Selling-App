require('dotenv').config();

const JWT_SECRET =process.env.JWT_SECRET;
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

module.exports ={
    JWT_SECRET, JWT_USER_PASSWORD
}