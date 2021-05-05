const Queue = require("../queue");

const queue = new Queue();

const addQueue = (req, res, next) => {

        try {
                const result = queue.enQueue({
                        user: req.user.uid,
                        licenseplate: req.body.licenseplate,
                        color: req.body.color
                });

                if(result !== null) {
                        return res.status(401).send({ message: result });
                }
        
                return res.status(200).send(queue.getPostion({ user: req.user.uid }));
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};      

const changeColor = (req, res, next) => {
        try {
                const result = queue.alterColor({
                        user: req.user.uid,
                        licenseplate: req.body.licenseplate,
                        color: req.body.color
                });

                if(result !== null) {
                        return res.status(401).send({ message: result });
                }
        
                return res.status(200).send(queue.getPostion({ user: req.user.uid }));
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const getPosition = (req, res, next) => {

        try {
                return res.status(200).send(queue.getPostion({ user: req.user.uid }));
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
}

const getQueue = (req, res, next) => {
        try {
                return res.status(200).send(queue.getQueue());
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

const removeFromQueue = (req, res, next) => {
        try {
                const result = queue.dropFromQueue({ 
                        user: req.user.uid, 
                        licenseplate: req.body.licenseplate 
                });

                if(result !== null) {
                        return res.status(401).send({ message: result });
                }

                return res.status(200).send(queue.getPostion({ user: req.user.uid }));
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
}

module.exports = { addQueue, changeColor, getPosition, getQueue, removeFromQueue };