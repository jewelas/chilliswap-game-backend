import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../../store/user/userSlice";
import eth from "../../../images/eth.jpg";
import Icon from "../../Icon";
const UserButton = ({ user, balance }) => {
  const dispatch = useDispatch();

  let { username, publicAddress } = user;

  const subKey = (key) => {
    return `${key.slice(0, 4)}...${key.slice(key.length - 4, key.length)}`;
  };

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <>
    

      <ul className="topheader-button-list d-flex">
        
        <li className="dropdown d-flex justify-content-between">
          <button
            //  onClick={()=> setDropdown(!dropdown)}
            className="btn btn-primary bid-button dropbtnd p-0 d-flex align-items-center"
          >
            
            <div style={{ padding: "2px 2px 2px 2px" }} className="">
              <h2>{balance} ETH</h2>
              {/*<p>{subKey(publicAddress)}</p>*/}
            </div>
          </button>

          <>
            <div className="dropdown-content">
              <div className="row">
                <div className="col-xl-12 text-center">
                 
                  <p className="pt-5">{username}</p>
                  <p>{subKey(publicAddress)}</p>
                  <div className="d-flex justify-content-between pl-4 pr-4 pb-2 dropLayout">
                    <img src={eth}></img>
                    <h5>
                      Balance <br />
                      <span className="font-weight-bold">{balance} ETH</span>
                    </h5>
                  </div>
                </div>
              </div>
              <ul className="dropLayer">

                <li>
                  <a href="#">
                    <div onClick={handleLogOut} className="">
                      <Icon name="exit" className="mx-2 ico"></Icon>Log Out
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            {/* <div  onClick={()=> setDropdown(false)} className="backdoor"></div> */}
          </>
        </li>
      </ul>
    </>
  );
};

export default UserButton;
