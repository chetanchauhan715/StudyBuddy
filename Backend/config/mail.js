import nodemailder from "nodemailer";

console.log(process.env.EMAIL_PASS);
const transporter = nodemailder.createTransport({
    service:"gmail",

    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

export default transporter;