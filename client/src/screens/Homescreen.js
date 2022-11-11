import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import moment from "moment";
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';
import Loader from "../components/Loader";
import Error from "../components/Error";
const { RangePicker } = DatePicker;
function Homescreen() {
    const [rooms, setrooms] = useState([])
    const [loading, setloading] = useState()
    const [error, seterror] = useState()

    const [fromdate, setfromdate] = useState()
    const [todate, settodate] = useState()
    const [duplicaterooms, setduplicaterooms] = useState([]);
    
    const [searchkey, setsearchkey] = useState('')
    const [type, settype] = useState('all')

    const [temprooms, settemprooms] = useState([]);


    const task = async () => {
        try {
            setloading(true)
            const data = (await axios.get("/api/rooms/getallrooms")).data;
            setrooms(data);
            setduplicaterooms(data)
            setloading(false)
        } catch (error) {
            seterror(true)
            console.log(error);
            setloading(false)
        }
    };

    useEffect(() => {
        task();
    }, []);
    function filterByDate(dates) {
        setfromdate(moment(dates[0]).format('DD-MM-YYYY'));
        settodate(moment(dates[1]).format('DD-MM-YYYY'));

        var temprooms = []
        for (var room of duplicaterooms) {
            var availability = false;

            for (var booking of room.currentbookings) {

                if (room.currentbookings.length) {
                    if (
                        !moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate) &&
                        !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate)
                    ) {
                        if (
                            moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
                            moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
                            moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
                            moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
                        ) {
                            availability = true;
                        }
                    }
                }


            }
            if (availability || room.currentbookings.length == 0) {
                temprooms.push(room)
            }
            setrooms(temprooms)
        }
    }

    function filterBySearch(a) {
        const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(a.toLowerCase()))
        setrooms(temprooms)
    }

    function filterByType(e) {
        settype(e) 
        if (e!=='all') {
            const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() == e.toLowerCase())
            setrooms(temprooms)
        }
        else {
            setrooms(duplicaterooms)
        }
    }
    return (
        <div className="container">

            <div className="row mt-5 bs">
                <div className="col-md-3">
                    <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
                </div>

                <div className="col-md-5">
                    <input type="text" className="form-control" placeholder='search rooms'  onChange={(e) => { filterBySearch(e.target.value) }}  />
                </div>

                <div className="col-md-3">
                    <select className="form-control" value={type} onChange={(e)=>{filterByType(e.target.value)}}>
                        <option value="all">All</option>
                        <option value="delux">Delux</option>
                        <option value="non-delux">Non-Delux</option>
                    </select>
                </div>

            </div>
            <div className="row justify-content-center mt-5">
                {loading ? (<Loader />) : rooms.length > 0 ? (rooms.map((room, index) => {
                    return <div key={index} className="col-md-9 mt-2">
                        <Room room={room} fromdate={fromdate} todate={todate} />
                    </div>
                })
                ) : (
                   <Error />     
                )}

            </div>

        </div>
    );
}


export default Homescreen;