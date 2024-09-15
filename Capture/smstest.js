const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "d1eb8683",
  apiSecret: "RALjCmCx90Tm4DUm"
})

const from = "Vonage APIs"
const to = "525577589666"
const text = 'A text message sent using the Vonage SMS API'

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();
