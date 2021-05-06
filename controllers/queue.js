const Queue = require("../queue");

const queue = new Queue();

const addQueue = (req, res, next) => {
        try {
                var user;
                if(req.user === "admin") {
                        user = req.body.user;
                } else {
                        user = req.user.name;
                }

                const result = queue.enQueue({
                        user,
                        licenseplate: req.body.licenseplate,
                        color: req.body.color
                });

                if(result !== null) {
                        return res.status(200).send({ message: result });
                }
        
                return res.status(200).send({
                        message: "Successfully Registered. Please wait for your turn."
                });

        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};      

const changeColor = (req, res, next) => {
        try {
                const user = req.user.name;
                const result = queue.alterColor({
                        user: user,
                        licenseplate: req.body.licenseplate,
                        color: req.body.color
                });

                if(result !== null) {
                        return res.status(200).send({ message: result });
                }
        
                return res.status(200).send({
                        message: "Color Change Successful. Please wait for your turn."
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const adminchangeColor = (req, res, next) => {
        try {
                
                const result = queue.adminalterColor({
                        licenseplate: req.body.licenseplate,
                        color: req.body.color
                });

                if(result !== null) {
                        return res.status(200).send({ message: result });
                }
        
                return res.status(200).send({
                        message: "Color Change Successful. Please wait for your turn."
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const getPosition = (req, res, next) => {
        try {
                var user;
                if(req.user === "admin") {
                        user = req.body.user;
                } else {
                        user = req.user.name;
                }

                return res.status(200).send({
                        message: "Positions Fetched",
                        currentqueue: queue.getPostion({ user })
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
}

const getQueue = (req, res, next) => {
        try {
                return res.status(200).send({
                        message: "Queue Fetched",
                        currentqueue: queue.getQueue()
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const admingetQueue = (req, res, next) => {
        try {
                return res.status(200).send({
                        message: "Queue Fetched",
                        currentqueue: queue.admingetQueue()
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const removeFromQueue = (req, res, next) => {
        try {
                const user = req.user.name;
                
                const result = queue.dropFromQueue({ 
                        user, 
                        licenseplate: req.body.licenseplate 
                });
                
                if(result !== null) {
                        return res.status(200).send({ message: result });
                }

                return res.status(200).send({
                        message: "Process Successfully aborted for " + req.body.licenseplate
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const adminAbort = (req, res, next) => {
        try {
                const result = queue.admindropFromQueue({ 
                        licenseplate: req.body.licenseplate 
                });
                
                if(result !== null) {
                        return res.status(200).send({ message: result });
                }

                return res.status(200).send({
                        message: "Process Successfully aborted for " + req.body.licenseplate
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};



module.exports = { addQueue, changeColor, getPosition, getQueue, 
        removeFromQueue, adminchangeColor, adminAbort, admingetQueue };