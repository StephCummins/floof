import React from 'react';
import Home from './Home';
import Rate from './Rate';
import Post from './Post';

function Main({currentPage, setCurrentPage}) {
  if (currentPage === 'home') {
    return <Home setCurrentPage={setCurrentPage}/>
  }
  else if (currentPage === 'rate') {
    return <Rate />
  }
  else if (currentPage === 'post') {
    return <Post />
  }
}

export default Main;