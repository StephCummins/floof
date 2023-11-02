import React from 'react';
import { useState } from 'react';

function UploadForm() {
  const [buttonColor, setButtonColor] = useState('#219EBC');
  const [buttonText, setButtonText] = useState('click to upload');

  function submitImage() {
    setButtonColor('#FF4F00');
    setButtonText('upload successful');
  }
  
  return (
    <>
      <form action="/addfloof" method="post" encType="multipart/form-data">
        <section className="formElements">
          <section className="floofInfo">
            <div className="labels">
              <label>Upload a pic:</label>
              <input type="file" name="floofPic"/>
            </div>
            <div className="labels">
              <label>Add your floof's name:</label>
              <input id="textboxid" type="text" name="floofName" />
            </div>
          </section>
          <button style={{backgroundColor: buttonColor}} onClick={() => submitImage()} className="uploadBtn">
            {buttonText}
          </button>
        </section>
      </form>
    </>
  )
}
export default UploadForm;
