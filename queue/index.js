const Node = require("./node");

class Queue {

        constructor() {
                this.head = null;
                this.tail = null;
                this.size = 0;
        }

        isEmpty() {
                if(this.size === 0) {
                        return true;
                }
                return false;
        }

        enQueue({ user, licenseplate, color }) {
                const node = new Node({ user, licenseplate, color });
                var qlist = this.getPostion({ user });

                for(var i = 0; i < qlist.length; i++) {
                        if(qlist[i].licenseplate === licenseplate) {
                                return "Car Already Queued for Painting.";
                        }
                }

                if(this.isEmpty()) {
                        this.head = node;
                        this.tail = node;
                        this.size = 1;
                        return null;
                }

                this.tail.next = node;
                this.tail = node;
                this.size += 1;
                return null;
        }

        deQueue() {

                if(this.isEmpty()) {
                        return  null;
                }

                if(this.size === 1) {
                        const node = this.head;
                        this.head = null;
                        this.tail = null;
                        this.size = 0;

                        return node;
                }

                const node = this.head;
                this.head = this.head.next;
                this.size -= 1;
                return node;
        }

        getFront() {
                if(this.isEmpty()) {
                        return null;
                }

                return this.head;
        }

        getQueue() {
                var list = [];
                for(var node = this.head; node !== null; node = node.next) {
                        list.push({ 
                                licenseplate: node.licenseplate,
                                color: node.color
                        });
                }
                return list;    
        }

        alterColor({ user, licenseplate,color }) {
                for(var node = this.head; node !== null; node = node.next) {
                        if(node.user === user && node.licenseplate === licenseplate) {
                                node.color = color;
                                return null;
                        }
                }

                return "Car currently not in Queue";
        }

        getPostion({ user }) {
                var list = [];
                var node = this.head;
                for(var i = 0; node !== null; i++) {
                        if(node.user === user) {
                                list.push({
                                        licenseplate: node.licenseplate,
                                        color: node.color,
                                        position: i + 1
                                });
                        }
                        node = node.next;
                } 

                return list;
        }

        dropFromQueue({ user, licenseplate }) {
                var node = this.head;
                
                if(this.isEmpty()) {
                        return "Car currently not in Queue";
                }
                if(this.head.user === user && this.head.licenseplate === licenseplate) {
                        this.head = this.head.next;
                        return null;
                }

                while(node !== null && node.next !== null) {
                        if(node.next.user === user && node.next.licenseplate === null) {
                                node.next = node.next.next
                                return null;
                        }
                        node = node.next;
                }

                return "Car currently not in Queue";
        }
};

module.exports = Queue;