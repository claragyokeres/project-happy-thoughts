import React, { useState, useEffect } from 'react'
import moment from 'moment'


export const App = () => {
  useEffect(() => {
    fetch("https://happyapietc.herokuapp.com/")
      .then(res => res.json())
      .then(json => {
        setThoughts(json)
      });
  }, []);

  const [thoughts, setThoughts] = useState([]);
  const [userText, setUserText] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault()
    fetch('https://happyapietc.herokuapp.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
      .then((res) => res.json())
      .then((userText) => {
        setThoughts((previousThoughts) => [userText, ...previousThoughts])
      })
  }

  const likeThought = (thought) => {
    fetch(`https://happyapietc.herokuapp.com/${thought._id}/like`, { method: 'POST' })
      .then((res) => res.json())
      .then((responsejson) => {
        const updatedThoughts = thoughts.map((heartthought) => {
          if (heartthought._id === thought._id) {
            heartthought.heart += 1
          }
          return heartthought
        })
        setThoughts(updatedThoughts)
      })
  }

  return (
    <div>
      <div className="thoughtBox">
        <form onSubmit={handleFormSubmit}>
          <p> What's making you happy right now?</p>
          <input type="text" onChange={event => setUserText(event.target.value)} value={userText} rows="4" minLength="5" maxLength="140" required />
          <br></br>
          <button type="submit">❤️ Send Happy Thought ❤️ </button>
        </form>
      </div>

      {thoughts.map(thought => (
        <div className="postedThoughts">
          <p key={thought._id}><h3>{thought.message}</h3> </p>

          <section className="cardbottom">
            <section className="like-section">

              <p> <button onClick={() => likeThought(thought)}><span role="img" aria-label="heart">❤️ </span></button> x {thought.heart} {moment(thought.createdAt).fromNow()} </p>
            </section>
          </section>

        </div>
      )
      )}
    </div>
  )
};