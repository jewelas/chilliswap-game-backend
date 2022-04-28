import React from 'react'
//import LoadingSvg from '../../images/loading/loading2.svg'
import loaderImg from '../../images/avatar.svg'

const Loading = () => {
    return (
        <div id="preloder">
           
        {/* <div className="loader">
        </div> */}
       <div className="loader-size">
       <img src={loaderImg} alt="loader" />

       </div>
     </div>

    )
    
}

export default Loading