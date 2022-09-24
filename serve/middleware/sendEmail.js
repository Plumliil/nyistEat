const nodemailer =require('nodemailer');

const email = {
    port: 465,
    config: {
        smtp: 'smtp.189.cn',
        sender: 'plumliil@189.cn',
        password: 'Tianyi200152.',
        name: 'NyistEat 助手 ：）',
        title: '验证码',
        body: ''
    }
}

//  邮件发送
//  建立 SMTP连接池
const transporter = nodemailer.createTransport({
    host: email.config.smtp,
    secureConnection: true,
    port: email.port,
    secure: true,
    auth: {
        user: email.config.sender,
        pass: email.config.password
    }
})

function emailSend(receiv,value) {
    const mailOptions = {
        from: `"${email.config.name} ?"<${email.config.sender}`,
        to: receiv,
        subject: email.config.title,
        title: email.config.title,
        html: `您正在注册NyistEat账号,验证码为${value},请尽快输入.`
    };
    transporter.sendMail(mailOptions, (err, res) => {
        if (err) return console.log(err);
        console.log('message:', res.messageId);
        console.log('sent:', res.response);
    })
}

module.exports={
    emailSend,
}
