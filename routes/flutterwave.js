const router = require("express").Router();
const Flutterwave = require('flutterwave-node-v3');
const { verifyTokenAndAuthorization } = require("./verifyToken");
const open = require('open');
const flw = new Flutterwave(process.env.FLUTTERWAVE_P_KEY, process.env.FLUTTERWAVE_S_KEY);

// PAYMENT
router.post("/payment", async (req, res) => {
    const payload = {
        "card_number": "5531886652142950",
        "cvv": "564",
        "expiry_month": "09",
        "expiry_year": "21",
        "currency": "NGN",
        "amount": req.body.amount,
        "redirect_url": "https://www.google.com",
        "fullname": "Olufemi Obafunmiso",
        "email": "olufemi@flw.com",
        "phone_number": "0902620185",
        "enckey": "611d0eda25a3c931863d92c4",
        "tx_ref": "MC-32444ee--4eerye4euee3rerds4423e43e" // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    
    }
        try {
            const response = await flw.Charge.card(payload)
            console.log(response)
            res.status(200).json(response)
            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)
    
                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                console.log(callValidate)
                res.status(200).json(callValidate)
    
            }
            if (response.meta.authorization.mode === 'redirect') {
    
                var url = response.meta.authorization.redirect
                open(url)
            }
    
            console.log(response)
            res.status(200).json(response);
    
    
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    
    
})

module.exports = router;
