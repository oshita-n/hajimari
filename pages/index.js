import { Footer } from '../src/components/Footer.js'
import { Header } from '../src/components/Header.js'
import TextareaAutosize from 'react-textarea-autosize';

var message;

export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="mt-10 mb-5 text-center">
        <form onSubmit={handleSubmit}>
          
          <TextareaAutosize id="text-form" value={message} onChange={handleChange} className="border py-2 px-3 text-grey-darkest resize-none overflow-hidden w-2/3" maxRows={6} minRows={1}></TextareaAutosize>
          <input type="submit" className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded relative -top-4 right-0" value="投稿する" />  
        </form>
      </div>
      <div id="message-area" className="bg-gray-400"></div>
      <Footer />
  </div>
  )
}

const handleChange = (e) => {
  message = e.target.value;
};

const handleSubmit = (e) => {
  e.preventDefault();
  document.getElementById("text-form").value = "";
  var p_message = document.createElement("p")
  p_message.textContent = message
  document.getElementById("message-area").after(p_message) 
};