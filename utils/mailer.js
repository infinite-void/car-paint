const mailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const logfile = fs.createWriteStream(__dirname + "mailer.log", { flags: 'a' });

const transport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
                user: process.env.emailuser,
                pass: process.env.emailpass
        }
});

const registrationMail = (email, link) => {
        const message = {
                from: "srinath@ctf",
                to: email,
                subject: "Welcome to car-paint! Verification mail.",
                html: "<h3>Welcome to car-paint<\h3> <br> <h4> Please <a href=" + 
                        link + ">Click Here!<\a> to verfiy your mail and continue.<\h4>"
        };

        transport.sendMail(message, function(err, info) {
                const date = new Date();
        	const time = date.toLocaleString("en-US", {
                	timeZone: "Asia/Kolkata" 
        	});
		
		if (err) {
			logfile.write("\n[ " + time + " ] Failure: Welcome mail NOT sent to " + email);
		} else {
			logfile.write("\n[ " + time + " ] Success: Welcome mail sent to " + email);
		}
        });
};

module.exports = { registrationMail };