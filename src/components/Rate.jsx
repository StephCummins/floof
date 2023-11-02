import React from 'react';
import { useState, useEffect } from 'react';
import VoteButton from './VoteButton';

function Rate() {
  const [dogOne, setDogOne] = useState({imageLocation: '657eb6fac6140a3916adf7e86ec4cb0b'});
  const [dogTwo, setDogTwo] = useState({imageLocation: '657eb6fac6140a3916adf7e86ec4cb0b'});

  const [dogOneApproval, setDogOneApproval] = useState(0);
  const [dogTwoApproval, setDogTwoApproval] = useState(0);

  const [voteIndex, setVoteIndex] = useState(-1);

  function getDogImages() {
    fetch('/loadfloofs')
    .then(res => res.json())
    .then (data => {
      console.log(data);
      setVoteIndex(-1);
      setDogOne(data[0].Item);
      const approvalOne = calculateDogApproval(data[0].Item);
      data[0].Item.approval = approvalOne;
      setDogOneApproval(approvalOne);

      setDogTwo(data[1].Item);
      const approvalTwo = calculateDogApproval(data[1].Item);
      data[1].Item.approval = approvalTwo;
      setDogTwoApproval(approvalTwo);

      checkForNewTopFloof(data[0].Item, data[1].Item);
    })
  }

  function calculateDogApproval(floof) {
    if (floof.totalVotes === 0 && floof.totalImageViews === 0) return 100;
    return Math.ceil((floof.totalVotes / floof.totalImageViews) * 100);
  }

  function checkForNewTopFloof(floofOne, floofTwo) {
    fetch('/gettopfloof')
      .then(res => res.json())
      .then(data => {
        let higherApproval;

        if (floofOne.approval > data.approval && floofTwo.approval > data.approval) {
          higherApproval = floofOne.approval >= floofTwo.approval ? floofOne : floofTwo;
        } else if (floofOne.approval > data.approval) {
          higherApproval = floofOne;
        } else if (floofTwo.approval > data.approval) {
          higherApproval = floofTwo;
        }

        console.log(higherApproval);

        if (higherApproval) {
          fetch('/updatetopfloof', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(higherApproval)
          });
        } else if (!higherApproval) {
          if (floofOne.id === data.floof_id) {
            fetch('/updatetopfloof', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify(floofOne)
            });
          } else if (floofTwo.id === data.floof_id) {
            fetch('/updatetopfloof', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify(floofTwo)
            });
          }
        }
      });
  }

  useEffect(() => {
    getDogImages();
  }, [])

  function vote(floof) {
    setVoteIndex(floof.name === dogOne.name ? 0 : 1);
    dogOne.totalImageViews += 1;
    dogTwo.totalImageViews += 1;
    floof.name === dogOne.name ? dogOne.totalVotes += 1 : dogTwo.totalVotes += 1;

    const previousDogOne = dogOne;
    const previousDogTwo = dogTwo;

    setDogOne({
      ...dogOne,
      name: "Loading...",
      imageLocation: '657eb6fac6140a3916adf7e86ec4cb0b'
    });

    setDogTwo({
      ...dogTwo,
      name: "Loading...",
      imageLocation: '657eb6fac6140a3916adf7e86ec4cb0b'
    });

    fetch('/updatefloofs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(previousDogOne)
    })

    fetch('/updatefloofs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(previousDogTwo)
    })

    getDogImages();
  }

  return (
    <>
      <main> 
        <section className="topFloof" id="ratingTopFloof">
          <h2>who's the cutest floof?</h2>
              <div className="flexDogs">
                  <div className="floofRatingBox">
                      <div className="tealFrame"><img className="innerFloofImg" src={`/images/${dogOne.imageLocation}`}/></div>
                      <h2 className="topFloofName">{dogOne.name}</h2>
                      <h3 className="percentRating">{dogOneApproval}% approval</h3>
                      < VoteButton index={0} voteIndex={voteIndex} clickToVote={() => vote(dogOne)}/>
                  </div>
                  <div className="floofRatingBox">
                      <div className="tealFrame"><img className="innerFloofImg" src={`/images/${dogTwo.imageLocation}`}/></div>
                      <h2 className="topFloofName">{dogTwo.name}</h2>
                      <h3 className="percentRating">{dogTwoApproval}% approval</h3>
                      < VoteButton index={1} voteIndex={voteIndex} clickToVote={() => vote(dogTwo)}/>
                  </div>
              </div>
              <div className="orangeBackgroundRate">
                  <div className="floofRatingBox">
                      <div className="tealFrame"><img className="innerFloofImg" src={`/images/${dogOne.imageLocation}`}/></div>
                      <h2 className="topFloofName">{dogOne.name}</h2>
                      <h3 className="percentRating">{dogOneApproval}% approval</h3>
                      < VoteButton index={0} voteIndex={voteIndex} clickToVote={() => vote(dogOne)}/>
                  </div>
                  <div className="floofRatingBox">
                      <div className="tealFrame"><img className="innerFloofImg" src={`/images/${dogTwo.imageLocation}`}/></div>
                      <h2 className="topFloofName">{dogTwo.name}</h2>
                      <h3 className="percentRating">{dogTwoApproval}% approval</h3>
                      < VoteButton index={1} voteIndex={voteIndex} clickToVote={() => vote(dogTwo)}/>
                  </div>
              </div>
          </section>
      </main>
      <footer className="rateFooter">
        <img className="footerPawprints" id="ratepaw" src={require("../images/pawprints_footer.png")} alt="orange paw prints"/>
      </footer>
    </>
  )
}

export default Rate;