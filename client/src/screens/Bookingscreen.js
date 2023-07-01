import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,
});
function getDifferenceInDays(date1, date2) {
  let a = date1.split("-");
  let b = new Date(a[1] + "-" + a[0] + "-" + a[2]);

  a = date2.split("-");
  let c = new Date(a[1] + "-" + a[0] + "-" + a[2]);
  const diffInMs = Math.abs(c - b);
  return diffInMs / (1000 * 60 * 60 * 24);
}
function Bookingscreen() {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState({});

  const roomid = useParams().roomid;
  const fromdate = useParams().fromdate;
  const todate = useParams().todate;

  const totaldays = getDifferenceInDays(fromdate, todate) + 1;

  const [totalamount, settotalamount] = useState();

  const task = async () => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "/login";
    }

    try {
      setloading(true);
      const data = (
        await axios.post("/api/rooms/getroombyid", { roomid: roomid })
      ).data;
      settotalamount(data.rentperday * totaldays);
      setroom(data);
      setloading(false);
    } catch (error) {
      seterror(true);
      setloading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    task();
  }, []);

  async function onToken(token) {
    //console.log(token);

    const bookingDetails = {
      room,
      user: JSON.parse(localStorage.getItem("currentUser")),
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };
    try {
      setloading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      console.log(result);
      setloading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setloading(false);
      Swal.fire("OOps", "Something went wrong", "error");
      console.log(error);
    }
  }
  console.log(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  return (
    <div className="m-5" data-aos="flip-left">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {totaldays}</p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalamount}</p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  token={onToken}
                  amount={totalamount * 100}
                  currency="INR"
                  stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
