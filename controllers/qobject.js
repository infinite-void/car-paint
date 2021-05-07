const Queue = require("../queue");

const queue = new Queue();

const getObject = () => {
        return queue;
}

module.exports = { getObject };