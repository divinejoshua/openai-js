import './App.css';

import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';

function App() {

  const [answer, setanswer] = useState("");

  // Create configuration object
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  console.log(process.env.REACT_APP_OPENAI_API_KEY)
  // create OpenAI configuration object
  const openai = new OpenAIApi(configuration);

  // Send request 
  const completion = async () => {
    try {
      let response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "Write me a poem",
      });

      setanswer(response.data.choices[0].text)
    }
    catch(error){
      console.log(error);
    }
  

};




  return (

    // Main box 
    <div className="App mx-auto mt-20 max-w-screen-sm">
      <header className="App-header">

        {/* Header  */}
        <h1 className="text-3xl font-bold">
          Diviner
        </h1>

        <p className='mt-4 text-sm font-bold text-gray-600'>
          <span className='bg-gray-300'>Meaning</span> like God or a god. "heroes with divine powers"
        </p>
      {/* Form input  */}
        <form className='mt-5'>
          <input 
          type="text" 
          required
          ></input>


          <br></br>

          {/* submit button  */}
          <button 
            type='submit' 
            onClick={() => completion()} 
            className='mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4'>
            Generate text
          </button>
        </form>

        {/* Display paragraph */}
        <p className='mt-6 leading-loose'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </header>
    </div>
  );
}

export default App;
