import React from 'react';
import { useState, useEffect } from 'react';

function VoteButton({clickToVote, voteIndex, index}) {
  let buttonColor;
  let buttonText;

  if (voteIndex === -1 ) {
    buttonColor = '#219EBC';
    buttonText = 'vote for me!';
  } else if (voteIndex === index) {
    buttonColor = '#FF4F00';
    buttonText = 'voted!';
  } else {
    buttonColor = '#767676';
    buttonText = 'voting over';
  }

  return (
    <>
      <button style={{backgroundColor: buttonColor}} onClick={clickToVote} className="voteBtn">
        {buttonText}
      </button>
    </>
  )
}

export default VoteButton;