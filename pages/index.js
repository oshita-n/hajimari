import { Footer } from '../src/components/Footer.js'
import { Header } from '../src/components/Header.js'
import TextareaAutosize from 'react-textarea-autosize';

var message;
var category;
var id_num = 0;
export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="container mx-auto w-2/3">
        <div className="mt-10 mb-5">
          <form onSubmit={handleSubmit}>
            <TextareaAutosize id="text-form" value={message} onChange={handleChange} className="text-gray-500 outline-none hover:border-gray-400 border py-2 px-3 resize-none overflow-hidden w-full" maxRows={6} minRows={1}></TextareaAutosize>
            <div className="text-right">
              <select name="category" value={category} onChange={handleChange2} className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded">
                <option value="recruit">就職・転職</option>
                <option value="work">仕事・人間関係</option>
                <option value="hobby">趣味</option>
                <option value="other">その他</option>
              </select>
              <input type="submit" className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" value="投稿する" />  
            </div>
          </form>
        </div>
        <div id="message-area" className=""></div>
      </div>
      <Footer />
  </div>
  )
}

const handleChange = (e) => {
  message = e.target.value;
};

const handleChange2 = (e) => {
  console.log(e.target.value);
  category = e.target.value;
};

const handleSubmit = (e) => {
  if (message == "" || !message || !message.match(/\S/g)){
    e.preventDefault();
    var tf = document.getElementById("text-form");
    tf.style.backgroundColor = "#E5E7EB";
    const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
    (async () => {
      await sleep(100);
      tf.style.backgroundColor = "#FFFFFF";
      await sleep(100);
      tf.style.backgroundColor = "#E5E7EB";
      await sleep(100);
      tf.style.backgroundColor = "#FFFFFF";
    })();
  } else {
    e.preventDefault();
    document.getElementById("text-form").value = "";
    var p_message = document.createElement("p");
    if (!category) category = "recruit";

    if (category == "recruit") {
      p_message.textContent = message + "\n" + "(" +  "カテゴリ: " + "就職・転職" + ")";
    } else if (category == "work") {
      p_message.textContent = message + "\n" + "(" +  "カテゴリ: " + "仕事・人間関係" + ")";
    } else if (category == "hobby") {
      p_message.textContent = message + "\n" + "(" +  "カテゴリ: " + "趣味" + ")";
    } else if (category == "other") {
      p_message.textContent = message + "\n" + "(" +  "カテゴリ: " + "その他" + ")";
    }
    var ma = document.getElementById("message-area");
    p_message.id = "ma_id" + id_num.toString();
    id_num + id_num + 1;
    p_message.className = "hover:text-gray-500 mt-3 text-xl text-gray-400 whitespace-pre-wrap";
    var hr = document.createElement("hr");
    hr.className = "border-dotted";
    ma.after(hr);
    ma.after(p_message);
    p_message = ""
    message = ""
  }
};