import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
    const boxArray = box.map((single_box, i) => {
        return <div className='bounding-box' key={i} style={{top: box[i].topRow, right: box[i].rightCol, bottom: box[i].bottomRow, left: box[i].leftCol}}></div>;
    });
    
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' src={imageUrl} alt='result' width='500px' height='auto'/>
                {boxArray}
            </div>
        </div>
    );
};

export default FaceRecognition;