import React from "react";

const WinnerPopup = ({ color, winner, onClose, onRemove }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div className="w-[700px]">
          <div
            className=" text-white text-xl font-medium py-5 px-4 rounded-t-lg"
            style={{
              background: color,
            }}
          >
            We have a winner!
            <button onClick={onClose} className="float-right">
              &times;
            </button>
          </div>
          <div className="bg-[#1D1D1D] rounded-b-lg shadow-lg p-6  w-full">
            <div className="text-white text-4xl mb-6">{winner}</div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className=" text-white py-2 px-4 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={onRemove}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WinnerPopup;
