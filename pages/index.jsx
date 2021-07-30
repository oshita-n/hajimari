import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect } from 'react';
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

export default function Home() {


  async function getMP3(){
    await execute()
  }

  function loadClient() {
    try {
      if (process.browser) {
        window.gapi.client.setApiKey(process.env.NEXT_PUBLIC_API_KEY);
        return window.gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1")
            .then(function() { console.log("GAPI client loaded for API"); },
                  function(err) { console.error("Error loading GAPI client for API", err); });
      }
    } catch (e) {
      if (e instanceof TypeError) {
        if (process.browser) {
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
                "text": agendaMessage
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
                      let date = new Date();
                      db.collection("yomiageonsei").add({
                        base64mp3: response,
                        text: agendaMessage,
                        timestamp: date.getTime()
                      })
                      .then(() => {
                          console.log("Document written");
                          loadMP3();
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
    console.log("load")
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

  function playMP3() {
    console.log("play")
    docsData.forEach((data) => {
      if (data["text"] == agendaMessage) {
        let base64MP3 = data["base64mp3"]["result"]["audioContent"].replace(/^.*,/, '')
        var audioElem = new Audio();
        audioElem.src = "data:audio/mpeg;base64," + base64MP3;
        audioElem.play();
        return true;
      }
    });
  }
  
  const [agendaMessage, setAgendaMessage] = useState("");
  
  // useState(() => {
  //   loadClient()
  //  })
  const handleChange = (e) => {
    setAgendaMessage(e.target.value);
  };

 
  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <div className="text-right">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" onClick={loadClient}>認証</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" onClick={getMP3} value={agendaMessage}>読み上げる</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">保存</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"　onClick={playMP3}>再生</button>
            </div> 
            <TextareaAutosize id="text-form" placeholder="テキストを入力" onChange={handleChange} className="text-black outline-none py-2 px-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize>           
          </div>
        </div>
        <Footer />
    </div>
  </div>
  )
  
}
