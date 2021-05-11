import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import Link from 'next/link'
import { useState, useEffect } from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

var category;
var username;
require('dotenv').config({path: "../.env"})
// Initialize Cloud Firestore through Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_ID
  });
}

var docsData = [];
var db = firebase.firestore();
// Dateオブジェクトを作成
var date = new Date() ;

export default function Home() {
  const [agendaMessages, setAgendaMessages] = useState([]);
  const [agendaMessage, setAgendaMessage] = useState("");
  
  // マウント時に一回だけ実行する
  useEffect(() => { 
    console.log(docsData.length);
    if (docsData.length === 0) {
      db.collection("message").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            docsData.push(doc.data().message);
        });
        setAgendaMessages((agendaMessages) => [...agendaMessages, ...docsData]);
      });
    }
    setAgendaMessages((agendaMessages) => [...agendaMessages, ...docsData]);
   }, []);

  const handleChange = (e) => {
    setAgendaMessage(e.target.value);
  };

  const handleChange2 = (e) => {
    console.log(e.target.value);
    username = e.target.value;
  };

  const handleChange3 = (e) => {
    category = e.target.value;
  };

  const handleSubmit = (e) => {
    if (agendaMessage == "" || !agendaMessage || !agendaMessage.match(/\S/g)){
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
      setAgendaMessages((agendaMessages) => [agendaMessage, ...agendaMessages]);

      document.getElementById("text-form").value = "";

      
      if (!category) category = "recruit";

      if (!username) {
        username = "";
      }
      if (category == "recruit") {

      } else if (category == "work") {
      } else if (category == "tech") {
      } else if (category == "hobby") {
      } else if (category == "other") {
      }

      db.collection("message").add({
        message: agendaMessage,
        username: username,
        category: category,
        timestamp:date.getTime()
      })
      .then(() => {
          console.log("Document written");
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });

      setAgendaMessage("")
    }
  };
  return (
    <div className="container mx-auto">
      <Header />
      <div className="container mx-auto w-2/3">
        <div className="mt-10 mb-5">
          <form onSubmit={handleSubmit}>
            <TextareaAutosize id="text-form" placeholder="質問内容を書いてください" onChange={handleChange} className="text-black outline-none hover:border-gray-400 border py-2 px-3 resize-none overflow-hidden w-full rounded" maxRows={6} minRows={1}></TextareaAutosize>
            <div className="text-right">
              <input type="text" placeholder="名前を入力できます" value={username} size="15" onChange={handleChange2} className="outline-none hover:border-gray-400 border border text-black py-2 px-3 rounded"/>
              <select name="category" value={category} onChange={handleChange3} className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded">
                <option value="recruit">就職・転職</option>
                <option value="work">仕事・人間関係</option>
                <option value="tech">技術相談</option>
                <option value="hobby">趣味</option>
                <option value="other">その他</option>
              </select>
              <input type="submit" className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" value="投稿する" />  
            </div>
          </form>
        </div>
        <div id="message-area">
          {agendaMessages.length !== 0 && agendaMessages.map((message) => (
            <div key={message}>
              <Link href={{
                pathname: '/agenda',
                query: { message: message },
              }}>
                <a>
                  <p className="hover:text-gray-500 mt-2 mb-2 text-xl text-black whitespace-pre-wrap">{message}</p>
                </a>
              </Link>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <Footer />
  </div>
  )
  
}
