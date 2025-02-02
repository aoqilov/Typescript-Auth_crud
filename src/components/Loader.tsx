import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="load-body">
      <div className="wrapper">
        <div className="dot"></div>
        <span className="text">Loading</span>
      </div>
    </div>
  );
};

export default Loader;
