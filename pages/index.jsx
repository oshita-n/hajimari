import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import {Fragment, useRef, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import { PlayIcon,TrashIcon } from '@heroicons/react/solid'
import { PlusIcon} from '@heroicons/react/outline'

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
  let [count, setCount] = useState(1);

  var tbRef = useRef([]);
  for(let i=0;i<1024;i++) {
    tbRef.current[i] = useRef(null);
  }
  
  function loadData() {
    setCount(parseInt(localStorage.getItem("count")))
    var localArray = JSON.parse(localStorage.getItem("textbox"))
    var tmpArray = []
    if (localArray != null) {
      for (let i=0; i<localArray.length; i++) {
        tmpArray.push(<TextBox value={localArray[i]} refs={i} />)
      }
      setTbElement([tmpArray])
    } 
  }

  function save() {
    for (let i=0; i<count;i++) {
      tbArray.push([tbRef.current[i].current.value])
    }
    localStorage.setItem("textbox", JSON.stringify(tbArray));
    localStorage.setItem("count", count);
  }

  var tbArray = [];
  function addTextBox() {
    setCount((prevCount) => prevCount + 1);
    setTbElement([tbElements, <TextBox refs={count} id={count} />]);
    //localStorage.setItem("count", count);
  }

  async function getMP3(sText){
    await execute(sText)
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
  function execute(sText) {
    try {
      if (process.browser) {
          return window.gapi.client.texttospeech.text.synthesize({
            "resource": {
              "input": {
                "text": sText
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
                      fastPlayMP3(response);
                      // let date = new Date();
                      // db.collection("yomiageonsei").add({
                      //   base64mp3: response,
                      //   text: sText,
                      //   timestamp: date.getTime()
                      // })
                      // .then(() => {
                      //     // console.log("Document written");
                      //     loadMP3()
                      //     // playMP3()
                      // })
                      // .catch((error) => {
                      //     console.error("Error adding document: ", error);
                      // });
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

  function fastPlayMP3(response) {
      audioElem.src = "data:audio/mpeg;base64," + response["result"]["audioContent"].replace(/^.*,/, '');
      audioElem.play();
  }
  
  function TextBox(props) {
    if(props.value) {
      const [text, setText] = useState(props.value[0]);
      const handleChange = (e) => {
        setText(e.target.value);
      };
      return (
        <div className="group">
          <div className="group flex mt-5"><TextareaAutosize  placeholder="テキストを入力" defaultValue={props.value} ref={tbRef.current[props.refs]} onChange={handleChange} className="hover:bg-green-200 border-2 rounded-md border-gray-300 outline-none py-2 p-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize><button className="mr-0 mx-auto mb-auto my-0 hidden group-hover:block"><PlayIcon onClick={() => getMP3(text)} className="h-8 w-8 text-gray-400 hover:text-gray-500" /></button></div>
        </div>
      );
    } else {
      const [text, setText] = useState(null);
      const handleChange = (e) => {
        setText(e.target.value);
      };
      return (
        <div className="group">
          <div className="group flex mt-5"><TextareaAutosize  placeholder="テキストを入力" defaultValue={props.value} ref={tbRef.current[props.refs]} onChange={handleChange} className="hover:bg-green-200 border-2 rounded-md border-gray-300 outline-none py-2 p-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize><button className="mr-0 mx-auto mb-auto my-0 hidden group-hover:block"><PlayIcon onClick={() => getMP3(text)} className="h-8 w-8 text-gray-400 hover:text-gray-500" /></button></div>
        </div>
      );
    }
  }



  const [login_state, setlogin] = useState(false)
  const [tbElements, setTbElement] = useState([<TextBox refs={0} id={count}/>])

  return (
    <div>
      <Header />
      <div className="flex container mx-auto">
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <div className="text-right mb-5">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"　onClick={save}>Save</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"　onClick={loadData}>Load</button>
            </div>
            <div className="group">
              {tbElements}
              <button className="text-3xl m-0 m-auto hidden group-hover:block" onClick={addTextBox}><PlusIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 mt-2" /></button>
            </div>
          </div>
        </div>
        <Footer />
    </div>
  </div>
  )
  
}