import UserButton from "./user";
const Desktop = ({ user, balance, onClickConnect }) => {
  return (
    <header className="header-section desktop-menu">
      <div className="container">
        <div className="inner-header">
          <div className="row">
            <div className="col-lg-2 col-md-2 col-10">
            </div>
            <div className="col-lg-3 col-md-4 col-12">
              {/* <SearchBar /> */}
            </div>
            <div className="col-lg-3 col-md-3 col-12 d-flex">
            {/* <Theme className="theme-big" /> */}
              {user ? (
                <UserButton user={user} balance={balance}></UserButton>
              ) : (
                <button
                  onClick={onClickConnect}
                  className="btn btn-outline-warning center"
                >
                  Connect Wallet 
                </button>
              )}
                 
            </div>

          </div>
        </div>
      </div>

     
    </header>
  );
};

export default Desktop;
