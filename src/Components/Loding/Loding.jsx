import React from 'react'
import { HashLoader } from 'react-spinners';

function Loding() {
  return (
    <div className="bg-main-light w-100 vh-75 d-flex align-items-center justify-content-center">
      <HashLoader
        color="#222"
        cssOverride={{}}
        loading
        margin={2}
        size={100}
        speedMultiplier={1}
      />
    </div>
  );
}

export default Loding
