import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import {Fragment, useRef, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PJID
  });
}

var db = firebase.firestore();

// ミリ秒間待機する
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Home() {
  useEffect(() => {
    loadClient()
  });

  async function getMP3(){
    await execute()
  }

  async function loadClient() {
    await sleep(1000)
    try {
      if (process.browser && login_state != true) {
        window.gapi.client.setApiKey(process.env.NEXT_PUBLIC_API_KEY);
        return window.gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1")
            .then(function() { 
              console.log("GAPI client loaded for API");
              setlogin(true);
            },function(err) { console.error("Error loading GAPI client for API", err); });
      } 
    } catch (e) {
        if (e instanceof TypeError) {
          if (process.browser && login_state != true) {
            window.gapi.client.setApiKey(process.env.NEXT_PUBLIC_API_KEY);
            return window.gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1")
                .then(function() { console.log("GAPI client loaded for API"); },
                      function(err) { console.error("Error loading GAPI client for API", err); });
        }
      }
    }
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    try {
      if (process.browser) {
          return window.gapi.client.texttospeech.text.synthesize({
            "resource": {
              "input": {
                "text": text
              },
              "audioConfig": {
                "audioEncoding": "MP3"
              },
              "voice": {
                "languageCode": "ja-JP",
                "name": "ja-JP-Standard-C",
                "ssmlGender": "MALE"
              }
            }
          })
              .then(function(response) {
                      // Handle the results here (response.result has the parsed body).
                      //console.log("Response", response);
                      fastPlayMP3(response);
                      let date = new Date();
                      db.collection("yomiageonsei").add({
                        base64mp3: response,
                        text: text,
                        timestamp: date.getTime()
                      })
                      .then(() => {
                          console.log("Document written");
                          loadMP3()
                          // playMP3()
                      })
                      .catch((error) => {
                          console.error("Error adding document: ", error);
                      });
                      // saveAs(createMP3Base64(response, "response.mp3"), "response.mp3")
                    },
                    function(err) { console.error("Execute error", err); });
        }
      if (process.browser) {
        window.gapi.load("client:auth2", function() {
          window.gapi.auth2.init({client_id: process.env.NEXT_PUBLIC_CLIENT_ID});
        });
      }
      
    } catch (e) {
      return null;
    }
  }
  
  var docsData = new Array();
  function loadMP3() {
    let i = 0;
    db.collection("yomiageonsei").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        docsData[i] = {};
        docsData[i]['base64mp3'] = doc.data().base64mp3;
        docsData[i]['text'] = doc.data().text;
        i++;
      });
    });
  }
  if (process.browser) {
    var audioElem = new Audio()
  }
  async function playMP3() {
    await sleep(8000) // 書き込む間、3秒間待つ
    if (playing == false) {
      docsData.forEach((data) => {
        if (data["text"] == text) {
          setPlay(true)
          let base64MP3 = data["base64mp3"]["result"]["audioContent"].replace(/^.*,/, '')
          audioElem.src = "data:audio/mpeg;base64," + base64MP3;
          audioElem.play();
          return true
        }
      });
      setPlay(false)
    }
  }

  function fastPlayMP3(response) {
      audioElem.src = "data:audio/mpeg;base64," + response["result"]["audioContent"].replace(/^.*,/, '');
      audioElem.play();
  }
  
  const [text, setText] = useState("")
  const [login_state, setlogin] = useState(false)

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <div className="text-right">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" onClick={getMP3} value={text}>読み上げる</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">保存</button>
            </div> 
            <TextareaAutosize id="text-form" placeholder="テキストを入力" onChange={handleChange} className="text-black outline-none py-2 px-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize>           
          </div>
        </div>
        <Footer />
    </div>
  </div>
  )
  
}
