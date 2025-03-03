import { useState, useEffect } from 'react';
import './App.css';
import QuoteInfo from './quoteInfo'; // capitalizing Q confuses VS Code, for some reason.
import { shuffleArray } from "./utils";
import Scoreboard from './scoreboard';

function App() {
  const [quotes, setQuotes] = useState([]); // holds current quotes
  const [page, setPage] = useState("start");
  const [isCorrect, setIsCorrect] = useState(null);
  const [viewResults, setViewResults] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [scoreCorrect, setScoreCorrect] = useState(0)
  const [scoreIncorrect, setScoreIncorrect] = useState(0)

  async function updateQuotes(fetchCount) {
    try {
      // Fetch 10 real quotes
      const quotableresponse = await fetch(`https://api.quotable.io/quotes/random?limit=${fetchCount}`);
      const data = await quotableresponse.json();

      if (!quotableresponse.ok) throw new Error("Failed to fetch real quotes");

      // Add 'real' key to real quotes
      const realQuotes = data.map(quote => ({ ...quote, real: true }));

      console.log("Real Quotes:", realQuotes);

      // fetches 10 fake quotes from ChatGPT
      const chatgptresponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: "user",
              content: `Create ${fetchCount} completely fictional motivational quotes and assign them to real famous figures. Format the response as a JSON array with 'author', 'content', and 'real' : false.`
            }
          ],
          max_tokens: 500,
          temperature: 1.3
        })
      });

      const chatgptdata = await chatgptresponse.json();
      if (!chatgptresponse.ok) throw new Error("Failed to fetch fake quotes");

      console.log("Raw ChatGPT Response:", chatgptdata);

      let fakeQuotes;
      try {
        fakeQuotes = JSON.parse(chatgptdata.choices[0].message.content.trim()); // Convert string to array
      } catch (error) {
        console.error("Failed to parse ChatGPT response:", error);
        return;
      }

      console.log("Fake Quotes:", fakeQuotes);

      let newQuotes = shuffleArray([...realQuotes, ...fakeQuotes]);
      console.log('all quotes being added:', newQuotes)
      // combines previous quotes (if there are any), real quotes, and fake quotes both from APIs
      setQuotes(prevQuotes => [...prevQuotes, ...newQuotes]);
      setCanStart(true)

    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  }

  const showResults = (answer) => {
    setViewResults(true)
      setIsCorrect(answer === quotes[0].real);
      handleScorecardUpate(answer === quotes[0].real)
        // does the user's answer (true or false) match the quote's 'real' key value?
    }

    const handleScorecardUpate = (answerWasRight) => {
      answerWasRight ? setScoreCorrect(scoreCorrect + 1) : setScoreIncorrect(scoreIncorrect + 1)
    }

  const handleNextQuote = () => {
    setQuotes(quotes.slice(1)); // removes the first index of the quotes state variable and sets it again.
    if(quotes.length <= 6) { updateQuotes(5)} //when low on quotes left, adds more. this should not affect the currently loaded quote from the last batch since it always reads the very first one.

    if (quotes.length > 0) {
      setViewResults(false);
    }
    // TODO: handle if user gets through quotes fast enough to end up with 0 quotes ready.
  }

  const handleStartGame = () => {
    if(canStart) {
      setPage("quiz")
    }
  }

  useEffect(() => {
    updateQuotes(2); // just gets two real and fake quotes. instantly will attempt to get more since it's less than 5.
  }, []);

  return (
    <div className="background"> {/* //checkerboard background */}
      <div className={`game-container ${viewResults ? (isCorrect ? "correct" : "incorrect") : ""}`}>
      {/* box containing game. if we are viewing results, use the is correct variable, otherwise leave blank. this still includes the regular game-container class. */}

      {/* <h4>{quotes.length}</h4> */}
      {/* QUOTES.LENGTH DEBUG */}

        {page === "start" && (
          <>
            <h1 className="game-title">Quote.exe</h1>
            <p className='game-subtitle'>Are these quotes real or written by ChatGPT?</p>
            <button style={{marginTop: "30px"}}  onClick={() => handleStartGame()}>
              Play
            </button>
          </>
        )}

        {page === "quiz" && (
          <>
            <h1 className='game-title'>{viewResults ? (quotes[0]?.real ? "Real Quote" : "ChatGPT") : "Real or AI?"}</h1>
            {/* { if statement ? (show when true) : (show when false) } */}
            <QuoteInfo quote={quotes[0]?.content} author={quotes[0]?.author} />
            <div className="options">
              {/* this div should be anchored to the bottom of the game container */}
              {!viewResults ? (
                <>
                  <button className='font-zendots' onClick={() => showResults(false)}>ChatGPT</button>
                  <button className='font-zendots' onClick={() => showResults(true)}>Real</button>
                </>
              ) : (
                <>
                  <button className='font-zendots' style={{ width: "350px"}} onClick={() => handleNextQuote()}>
                    Next Quote
                  </button>
                </>
              )}

            </div>
            <Scoreboard correct={scoreCorrect} incorrect={scoreIncorrect} />

          </>
        )}
     
      </div>
    </div>
  );
}

export default App;
