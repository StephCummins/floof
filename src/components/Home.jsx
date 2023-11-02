import React from 'react';
import { useState, useEffect } from 'react';

function Home({setCurrentPage}) {
  const [topFloof, setTopFloof] = useState('657eb6fac6140a3916adf7e86ec4cb0b');
  const [topFloofName, setTopFloofName] = useState('loading');
  const [topFloofApproval, setTopApproval] = useState('0');

  useEffect(() => {
    fetch('/gettopfloof')
      .then(res => res.json())
      .then (data => {
        setTopFloof(data.imageLocation);
        setTopFloofName(data.name);
        setTopApproval(data.approval);
      })
  });

  return (
    <>
      <main>
        <section className="topFloof">
          <h2>top floof of the day</h2>
          <section className="overlappingElements">
              <div className="orangeBackground">
                  <div className="tealBorder"></div>
              <img className="floofImg" src={`/images/${topFloof}`}/> 
              </div>       
          </section>
          <section className="floofInfoRating">
              <h2 className="topFloofName">{topFloofName}</h2>
              <h3 className="percentRating">{`${topFloofApproval}% approval`}</h3>
          </section>
          <section className="mainBtn">
              <button onClick={() => setCurrentPage('rate')} className="ratingBtn">
                  rate the cutest floof
              </button>
              <button onClick={() => setCurrentPage('post')} className="mainBtn">
                  post a pic of your floof
              </button>
          </section>
        </section>
      </main>
      <footer>
        <img className="footerPawprints" src={require("../images/pawprints_footer.png")} alt="orange paw prints"/>
      </footer>
    </>
  )
}

export default Home;