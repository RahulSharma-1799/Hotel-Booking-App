import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
import { Divider, Tag } from 'antd';
const { TabPane } = Tabs;

function Profilescreen() {

    const user = JSON.parse(localStorage.getItem('currentUser'));
    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, [])



    return (
        <div className='ml-3 mt-3'>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1" className='bs col-md-5'>
                    <h1>My Profile</h1>
                    <hr />
                    <p><b>Name</b> : {user.name}</p>
                    <p><b>Email</b> : {user.email}</p>
                    <p><b>isAdmin</b> : {user.isAdmin ? 'Yes' : 'No'}</p>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Profilescreen

export function MyBookings() {

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [bookings, setbookings] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()

    useEffect(() => {
        const task = async () => {
            try {
                setloading(true)
                const data = (await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id })).data
               
                setbookings(data)
                setloading(false)
            } catch (error) {
                console.log(error)
                setloading(false)
                seterror(error)
            }
        }
        task();
    }, [])

    async function cancelBooking(bookingid,roomid) { 
        try {
            setloading(true)
            const result = (await axios.post('/api/bookings/cancelbooking', { bookingid, roomid })).data
            console.log(result)
            setloading(false)
            Swal.fire('Congratulations', 'Your booking has been cancelled', 'success').then(result => {
                window.location.reload();
            });
        } catch (error) {
            console.log(error)
            setloading(false)
            Swal.fire('OOps', 'Something went wrong', 'error');
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && (<Loader />)}
                    {bookings && (bookings.map((booking,index) => {
                        return (
                            <div key={index} className='bs'>
                                <h1>{booking.room}</h1>
                                <p><b>BookingId</b> : {booking._id}</p>
                                <p><b>Check In</b> : {booking.fromdate}</p>
                                <p><b>Check Out</b> : {booking.todate}</p>
                                <p><b>Amount</b> : {booking.totalamount}</p>
                                <p><b>Status</b> :
                                    {booking.status == 'CANCELLED' ? (<Tag color="red">CANCELLED</Tag>) : (<Tag color="green">CONFIRMED</Tag>)}
                                </p>

                                {booking.status !== 'CANCELLED' && (
                                    <div className='text-right'>
                                        <button className='btn btn-primary' onClick={() => { cancelBooking(booking._id, booking.roomid) }}>CANCEL BOOKING</button>
                                    </div>
                               )}
                            </div>
                        )
                    }))}
                </div>
            </div>
        </div>
    )
}
