
class Node {

        constructor({ user, licenseplate, color }) {
                this.user = user;
                this.licenseplate = licenseplate;
                this.color = color;
                this.next = null;
        }
};

module.exports = Node;