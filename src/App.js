import './App.css';

import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';

function App() {

  const [result, setresult] = useState("");     //Result from OpenIA
  const [prompt, setprompt] = useState("");     //Prompt question to OpenAIA
  const [isLoading, setisLoading] = useState(false);     //Prompt question to OpenAIA

  // Create configuration object
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  // create OpenAI configuration object
  const openai = new OpenAIApi(configuration);



  // Submit form 
  function submitForm(event){

    //Preventing page refresh
    event.preventDefault();

    // Call the OpenAI completion Function 
    completion()
 }



  // Send request 
  const completion = async () => {
    // 
    if(!prompt) {return}      //return if there is a prompt message    
    if(isLoading) {return}    //return if request is already loading

    // Set loading to true
    setisLoading(true);

    // Send the request 
    try {
      let response = await openai.createCompletion({
        prompt: prompt,
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["{}"],
      });

      setresult(response.data.choices[0].text)
    }

    // Check if any errors 
    catch(error){
      console.log(error);
    }
  
    // If Request is complete 
    finally{
      setisLoading(false)
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

        <p className='mt-4 text-xs text-gray-400 leading-loose'>
          <span className='text-xs font-bold bg-gray-100 pt-1 pb-1 pl-2 pr-2'> Meaning</span> &nbsp;&nbsp;like God or a god. "heroes with divine powers"
        </p>


      {/* Form input  */}
        <form className='mt-7' onSubmit={submitForm} method="post">
          <textarea 
          type="text" 
          required
          autoFocus={true}
          placeholder='Ask Didi anything...'
          onChange = {e => setprompt(e.target.value)}
          className='w-full p-2 pt-3 pb-3 pr-5 pl-5 rounded-none border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-0.5 focus:border-100 transition duration-0 hover:duration-150'
          ></textarea>

 
          <br></br>

          {/* submit button  */}
          <button 
            type="submit"
            disabled={isLoading}
            className={(isLoading ? 'none bg-gray-200 hover:bg-gray-200 text-gray-500 ' : 'shadow shadow-blue-500/50') + 'none mt-7 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 '}>
            Submit
          </button>
        </form>

        {/* Display paragraph */}

        <br></br>

        {/* Result section  */} 
        <section>
          {!isLoading && result && <span className='text-xs bg-green-50 pt-1 pb-1 pl-2 pr-2 text-green-500'> Result</span> }


          {!isLoading && !result && 
            <p className='leading-loose text-gray-500'>
              <span className='font-bold text-blue-500'>Didi</span> AI is a <span className='font-bold text-blue-500 underline underline-offset-4'>digital diviner</span> that can be consulted to answer questions based on trained AI models.  
            </p>
          }

          {/* Result paragraph */}
          <div className='display-paragraph leading-loose'>

           { isLoading ? 
              //  Loader 
              <div className='mx-auto mt-6 loader-spinner rounded-full border border-4 animate-spin'></div> :

              // Results 
              result
           }
            
          </div>

          <br></br>

          <p className='reference text-xs text-gray-400'>Knowledge base up to 2021</p>
          <a href='https://openai.com' target="_blank" className='reference text-xs text-gray-400'>Reference: OpenAI.com</a>

        </section>

      </header>
    </div>
  );
}

export default App;
