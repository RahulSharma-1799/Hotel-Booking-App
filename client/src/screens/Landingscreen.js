import React from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css'; 
AOS.init({
    duration: 2000
});
function Landingscreen() {
  return (
    <div className='row landing justify-content-center'>
          <div className='col-md-9 my-auto text-center' style={{borderRight:'6px solid white'}}>
              <h2 data-aos='zoom-in' style={{color:'white',fontSize:'100px'}}>Booking Room</h2>
              <h1 data-aos='zoom-out'style={{color:'white'}}>There is only one boss.The Guest.</h1>
              <Link to='/home'>
                    <button className='btn landingbtn'>Get Started</button>
              </Link>
        </div>
    </div>
  )
}

export default Landingscreen
