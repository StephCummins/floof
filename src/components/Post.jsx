import React from 'react';
import UploadForm from './UploadForm';

function Post() {
  return (
    <>
      <main>
        <section className="topFloof" id="postTopFloof">
          <h2>upload a pic</h2>
          <section className="overlappingElements">
              <div className="orangeBackground" id="orangePost"> 
              <div className="tealBorder"></div>
              <div className="whiteBox"><p>your floof here</p></div> 
              </div>   
          </section>
          <section className="mainBtn">
            <UploadForm />
          </section>
        </section>
      </main>
      <footer>
        <img className="footerPawprints" src={require("../images/pawprints_footer.png")} alt="orange paw prints"/>
      </footer>
    </>
  )
}

export default Post;