import './App.css';
import { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";    //OpenAI 
import Typewriter from 'typewriter-effect';     //Typewriter effect
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';

import GlobalStyles from "@mui/material/GlobalStyles";

import {
  Link,
  List,
  Typography,
} from "@mui/material";



function App() {

  const [result, setresult] = useState("");     //Result from OpenIA
  const [messageList, setmessageList] = useState([])
  const [prompt, setprompt] = useState("");     //Prompt question to OpenIA
  const [isLoading, setisLoading] = useState(false);     //Prompt question to OpenIA
  const [isTypeWriting, setisTypeWriting] = useState(false);     //If the typewriter effect is loading.
  const [welcomeText, setwelcomeText] = useState("Didi AI is a digital diviner designed to provide helpful and informative responses to your questions and inquiries with the help of artificial intelligence.");
  const [isTypingWelcome, setisTypingWelcome] = useState(true); //If the welcoming test is loading
  const [isFirstCall, setisFirstCall] = useState(true)
  // Create configuration object
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });


  // create OpenAI configuration object
  const openai = new OpenAIApi(configuration);

    // Override react-markdown elements to add class names
    const P = ({ children }) => <p className="">{children}</p>
    const Li = ({ children }) => <li className="">{children}</li>
    const H4 = ({ children }) => <h4 className="">{children}</h4>
    const Hr = () => <hr className="md-post-hr" />
  


  // Submit form 
  function submitForm(event){

    //Preventing page refresh
    event.preventDefault();

    // Call the OpenAI completion Function 
    completion()
 }

  // new messages list 
  let newMessages = []

  // Send request 
  const completion = async () => {
    // 
    if(!prompt) {return}      //return if there is no prompt message    
    if(isLoading) {return}    //return if request is already loading

    
    setisLoading(true);     // Set loading to true
    setresult("");    // Set result to empty string

    // Set the message. Role as user
   
    newMessages = [...messageList]

    //If its the first call add the system
    if (isFirstCall){
      newMessages.push({"role": "system", "content": "You are a helpful assistant called Didi Ai. when displaying code, add the name of the language in front, eg: ```javascript  ...the code ```. Make sure your answers are always in markdown. indent the sublist with at least 4 spaces:"},)
    }
    newMessages.push({role: "user", content: prompt})
    setmessageList(newMessages)

    setisFirstCall(false)

  
    //Set the prompt to nothing. This is done in order to remove the text from the textarea
    setprompt("")
 
    // Send the request 
    try {

      let response = await openai.createChatCompletion({ 
        
        model: "gpt-4",
        temperature: 0,
        max_tokens: 4000,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["{}"],
        messages: newMessages,
      });

      setisTypeWriting(true) //Set the typewriter effect to true

      //set the result to answer
      let answer = response.data.choices[0].message.content
      setresult(answer.trim())

      //Add response to the message List as role:assistant
      //Read the chat-completion OpenAI Docs for more context https://platform.openai.com/docs/api-reference/chat/create
      newMessages.push({role: "assistant", content: answer})
      setmessageList(newMessages)

      

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
    <div className="App mx-auto">

      {/* Navbar */}
      <nav className="nav-header font-bold pl-5 pr-5">   
        <div className='nav-div pb-4'>
          Didi AI
          {/* Link to twitter account  */}
          <a href='https://twitter.com/Divine_Er' rel="noreferrer" target="_blank" > 
            <span className='float-right'> <i className="fa fa-brands fa-twitter text-gray-400"></i></span>
          </a>
          {/* Link to codebase  */}
          <a href='https://github.com/divinejoshua/openai-js' rel="noreferrer" target="_blank" >
            <span className='float-right mr-4'> <i className="fa fa-brands fa-github text-gray-400"></i></span>
          </a>
        </div>
      </nav>



        {/* Display paragraph */}

        <br></br><br></br><br></br><br></br>
        <div className='main pr-5 pl-5'>

            {/* About Didi AI  */}         
              <div className='leading-loose text-sm text-gray-700'>
                <div className='font-bold text-pink-500' data-testid="my-element">Didi</div>
                {isTypingWelcome ?
                  <Typewriter
                      onInit={(typewriter) => {
                        typewriter.typeString(welcomeText)
                      .start()
                      .callFunction(() => {
                        setisTypingWelcome(false)
                      })
                      }}
                      options={{
                        delay: 10,
                      }}
                    /> :
                    welcomeText
                  }
              </div>

            {/* Result paragraph */}
            <section>
              <div className='display-paragraph text-sm text-gray-700 leading-loose'>

              {/* Loop through the messages  */}
              {Array.isArray(messageList) ? messageList.map((post,index) => (
                  <div key={index} className="message-list">

                  {/* The role  */}
                  {
                    post.role ==='user' ?
                    <div className='mt-4 text-blue-500 font-bold'>Me</div>
                    : post.role ==='assistant' ?
                    <div className='mt-4 text-pink-500 font-bold'>Didi</div>
                    : null 
                  }
                  {/* Add type writter effect for new incoming messages  */}
                  {post.role !== "system" && post.role === "assistant" ?
                        <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="markdown"
                        components={{
                          // *********
                          // * Links *
                          // *********
                          a: ({ href, title, children }) => (<Link href={href} target="_blank" underline={"always"}>{children}</Link>),
                  
                          // ********
                          // * Text *
                          // ********
                          // p: ({ children }) => (<Typography sx={{ mt: 1 }}>{children}</Typography>),
                          del: ({ children }) => (<Typography sx={{ mt: 1, textDecoration: "line-through" }}>{children}</Typography>),
                          em: ({ children }) => (<Typography sx={{ mt: 1, fontStyle: "italic" }}>{children}</Typography>),
                          strong: ({ children }) => (<Typography sx={{ mt: 1, fontWeight: "bold" }}>{children}</Typography>),
                          b: ({ children }) => (<Typography sx={{ mt: 1, fontWeight: "bold" }}>{children}</Typography>),
                          h1: ({ children }) => (<h1 className='h1'>{children}</h1>),
                          h2: ({ children }) => (<h2 className='h2'>{children}</h2>),
                          h3: ({ children }) => (<h3 className='h3'>{children}</h3>),
                          h4: ({ children }) => (<h4 className='h4'>{children}</h4>),
                          h5: ({ children }) => (<h5 className='h5'>{children}</h5>),
                          h6: ({ children }) => (<h6 className='h6'>{children}</h6>),
                  
                          // *********
                          // * Lists *
                          // *********
                          ol: ({ children }) => (<List sx={{
                            listStyleType: "decimal",
                            mt: 2,
                            pl: 2,
                            "& .MuiListItem-root": {
                              display: "list-item",
                            },
                          }}>{children}</List>),
                          ul: ({ children }) => (<List sx={{
                            listStyleType: "disc",
                            mt: 2,
                            pl: 2,
                            "& .MuiListItem-root": {
                              display: "list-item",
                            },
                          }}>{children}</List>),
                          li: ({ children, ...props }) => (
                            <li className='li'>{children} </li>),
                  
                          // ********
                          // * Code *
                          // ********
                          //@ts-ignore
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "");
                            return (
                              <>
                                <GlobalStyles styles={{ code: { color: "inherit", background: "transparent" } }} />
                                <SyntaxHighlighter
                                  style={xonokai}
                                  language={match ? match[1] : undefined}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </>
                            );
                          },
                        }}
                      >
                        {post.content.trim()}
                      </ReactMarkdown>
                  : post.role === "user" ?
                    post.content.trim()
                  : null

                  }
                </div>
                  )) : ""}

                {/* If request is loading  */}
                { isLoading && 
                <div>
                  <div className='mt-4 text-pink-500 font-bold'>Didi</div>
                  <span className='text-gray-400'>Searching...</span>
                </div>
                }
                
              </div>

            </section>
            

              <br></br>


          {/* Form input  */}
            <form className='mt-7' onSubmit={submitForm} method="post">
              <textarea 
              type="text" 
              required
              autoFocus={true}
              placeholder='Ask Didi anything...'
              onChange = {e => setprompt(e.target.value)}
              value={prompt}
              className='w-full text-gray-700 text-sm p-2 pt-3 pb-3 pr-5 pl-5 rounded border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-0.5 focus:border-100 transition duration-0 hover:duration-150'
              ></textarea>

    
              <br></br>

              {/* submit button  */}
              <button 
                type="submit"
                disabled={isLoading}
                className={(isLoading ? 'none bg-gray-200 hover:bg-gray-200 text-gray-500 ' : ' bg-blue-500  hover:bg-blue-700') + 'none float-right rounded mt-7 text-sm text-white font-bold py-2 px-4 '}>
                Send <i className="fa-regular fa-paper-plane"></i>
              </button>


            </form>

        </div>

      <br></br><br></br><br></br>

       <div className='pl-5 pr-5'>
          <p className='reference text-xs text-gray-400'>Knowledge base up to September 2021</p>
          <a href='https://openai.com' rel="noreferrer" target="_blank" className='reference text-xs text-gray-400'>Reference: OpenAI.com</a>
      </div>
      <br></br><br></br><br></br>

     
    </div>
  );
}

export default App;
