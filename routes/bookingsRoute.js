const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/booking")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Room = require("../models/room")
router.post('/bookroom', async (req, res) => {

    const {
        room,
        user,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body;

    try {

        const customer = await stripe.customers.create({
            email: token.email,
            metadata: {
                source: token.id
            }
        });
        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            currency: 'inr',
            // customer: customer.id,
            receipt_email: token.email,
            source: 'tok_amex',
            // description: 'My First Test Charge'
        },
            {
                idempotencyKey: uuidv4(),
            }
        );
        if (payment) {
            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid: user._id,
                fromdate,
                todate,
                totalamount,
                totaldays,
                transactionId: "123"
            })
            const booking = await newbooking.save();
            const roomtemp = await Room.findOne({ _id: room._id });
            roomtemp.currentbookings.push({ bookingid: booking._id, fromdate: fromdate, todate: todate, userid: user._id, status: booking.status })

            await roomtemp.save();


        }

        res.send('Payment Successfully , You Room is booked')
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error });
    }

});


router.post('/getbookingsbyuserid', async (req, res) => {
    const userid = req.body.userid;
    try {
        const bookings = await Booking.find({ userid: userid })

        res.send(bookings)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error })
    }
});

router.post('/cancelbooking', async (req, res) => {
    const { bookingid, roomid } = req.body;
    try {
        const bookingitem = await Booking.findOne({ _id: bookingid })
        bookingitem.status = 'CANCELLED';
        await bookingitem.save();

        const room = await Room.findOne({ _id: roomid })
        const bookings = room.currentbookings;
        
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
        room.currentbookings = temp;

        await room.save();

        res.send('Your booking cancelled successfully')

    } catch (error) {
        console.error(error)
        return res.status(400).json({ error })
    }
});

router.get("/getallbookings", async (req, res) => {
    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error })
    }
});


module.exports = router