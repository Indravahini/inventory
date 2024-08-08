import React from 'react';
import Barcode from 'react-barcode';

const BarcodeImage = ({ value }) => {
  return (
    <div>
      <Barcode value={value} />
    </div>
  );
};

export default BarcodeImage;
