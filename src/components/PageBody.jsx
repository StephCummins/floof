import React from 'react';
import { useState } from 'react';
import Main from './Main.jsx';

function PageBody() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <header>
          <nav>
              <section className="logo"><h1 onClick={() => setCurrentPage('home')}>floof</h1></section>
              <ul>
                  <li onClick={() => setCurrentPage('rate')}>rate</li>
                  <li onClick={() => setCurrentPage('post')}>post</li>
              </ul>
          </nav>
      </header>
      <Main currentPage={currentPage} setCurrentPage={(value) => setCurrentPage(value)}/>
    </>
  )
}

export default PageBody;