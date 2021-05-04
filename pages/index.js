import { Footer } from '../src/components/Footer.js'
import { Header } from '../src/components/Header.js'
import TextareaAutosize from 'react-textarea-autosize';

var message;
var id_num = 0;
export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="mt-10 mb-5 text-center">
        <form onSubmit={handleSubmit}>
          
          <TextareaAutosize id="text-form" value={message} onChange={handleChange} className="text-gray-500 border py-2 px-3 text-grey-darkest resize-none overflow-hidden w-2/3" maxRows={6} minRows={1}></TextareaAutosize>
          <input type="submit" className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded relative -top-4 right-0" value="投稿する" />  
        </form>
      </div>
      <div id="message-area"></div>
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
  var ma = document.getElementById("message-area");
  p_message.id = "ma_id" + id_num.toString();
  id_num + id_num + 1;
  p_message.className = "text-gray-500 whitespace-pre-wrap"
  ma.after(document.createElement("hr"))
  ma.after(p_message) 
};