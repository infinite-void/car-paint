const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config/config.json");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ 
        extended: false 
}));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/user");

app.use("/api/user", userRoutes);

const db = config.MONGO_URI;

mongoose.set('useCreateIndex', true);
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
                console.log("Connected to DB");
        }).catch(error => {
                console.log(error);
        });

const port = process.env.PORT || 3000;

app.listen(port, () => {
        console.log(`Listening on port ${port}`);
});