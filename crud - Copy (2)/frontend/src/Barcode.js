import React, { useState } from 'react';
import qrcode from 'qrcode';

const QRCodeEx = () => {
    const [text, setText] = useState('');
    const [imageQR, setImageQR] = useState('');
    
    const generateBarcode = async () => {
        try {
            const image = await qrcode.toDataURL(text);
            setImageQR(image);
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="container mx-auto mt-2">
            <div className="row text-center badges bg-secondary">
                <h2>QRcode Generator</h2>
            </div>
            <div className="row mt-2">
                <input
                    className="col-sm-6"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    className="col-sm-2 mx-2 btn btn-primary"
                    onClick={generateBarcode}
                >
                    Generate QRcode
                </button>
            </div>
            <div className="row mt-2">
                <div className="card col-sm-4">
                    <div className="card-header m-1 rounded text-center">
                        <h3>QR Code Image</h3>
                    </div>
                    <div className="card-body text-center">
                        {imageQR && <img src={imageQR} alt="qr code" />}
                    </div>
                </div>
                <div className="card col-sm-4">
                    <div className="card-header m-1 rounded text-center">
                        <span className="btn btn-warning">
                            <h5>Open QR Code Files</h5>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeEx;
