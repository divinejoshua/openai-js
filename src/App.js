import './App.css';

import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';

function App() {

  const [result, setresult] = useState("");
  const [prompt, setprompt] = useState("");

  // Create configuration object
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  console.log(process.env.REACT_APP_OPENAI_API_KEY)
  // create OpenAI configuration object
  const openai = new OpenAIApi(configuration);

  // Send request 
  const completion = async () => {
    // Check if there is a prompt message 
    if(!prompt) {return}

    // Send the request 
    try {
      let response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "Write me a poem",
      });

      setresult(response.data.choices[0].text)
    }

    // Check if any errors 
    catch(error){
      console.log(error);
    }
  

};




  return (

    // Main box 
    <div className="App mx-auto mt-20 max-w-screen-sm p-7">
      <header className="App-header">

        {/* Header  */}
        <h1 className="text-3xl font-bold">
         Didi AI
        </h1>

        <p className='mt-4 text-xs font-bold text-gray-400 leading-loose'>
          <span className='text-xs bg-gray-100 pt-1 pb-1 pl-2 pr-2'> Meaning</span> &nbsp;&nbsp;like God or a god. "heroes with divine powers"
        </p>


      {/* Form input  */}
        <form className='mt-7'>
          <input 
          type="text" 
          required
          autoFocus={true}
          placeholder='Ask Didi anything'
          className='w-full p-2 pt-3 pb-3 pr-5 pl-5 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-0.5 focus:border-100 transition duration-0 hover:duration-150'
          ></input>


          <br></br>

          {/* submit button  */}
          <button 
            type='submit' 
            onClick={() => completion()} 
            className='mt-7 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 shadow shadow-blue-500/50'>
            Submit
          </button>
        </form>

        {/* Display paragraph */}
        <p className='mt-8 leading-loose'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </header>
    </div>
  );
}

export default App;
