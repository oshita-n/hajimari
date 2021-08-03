import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import {Fragment, useRef, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import { Menu, Transition, Dialog } from '@headlessui/react'
import { PlayIcon, TrashIcon } from '@heroicons/react/solid'


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

  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal1() {
    setIsOpen(true)
    insertCheckBox()
  }

  function openModal2() {
    setIsOpen(true)
    setTbElement([<TextBox value="tako" />, tbElements])
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

  function TextBox(props) {
    const [text2, setText2] = useState("")
    const handleChange2 = (e) => {
      setText2(e.target.value);
    };
    return (
      <div className="group flex"><TextareaAutosize  placeholder="テキストを入力" onChange={handleChange2} className="outline-none py-2 p-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize><button className="mr-0 mx-auto mb-auto my-3 hidden group-hover:block"><PlayIcon onClick={() => getMP3(text2)} className="h-5 w-5 text-gray-400 hover:text-gray-500" /></button><button className="mr-0 mx-auto mb-auto my-3 hidden group-hover:block"><TrashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" /></button></div>
    );
  }

  const [checkBox, setCheckBox] = useState("")
  const [login_state, setlogin] = useState(false)
  const [tbElements, setTbElement] = useState([])

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <Header />
      <div className="flex container mx-auto">
        <div className="group container mx-auto w-2/6 text-right">
          {checkBox}
          <Menu as="div" className="relative inline-block text-left text-right hidden group-hover:block">
              <div>
                <Menu.Button className="text-black text-3xl">
                  +
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <button
                        className="text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-sm"
                        onClick={openModal2}
                      >
                        Add TextBox
                      </button>
                    </Menu.Item>
                  </div>                 
                </Menu.Items>
              </Transition>
            </Menu>
        </div>
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <div className="text-right">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">保存</button>
            </div>
            <div className="group flex">
              <TextareaAutosize  placeholder="テキストを入力" onChange={handleChange} className="text-black outline-none py-2 px-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize>           
              <button className="hidden group-hover:block mr-0 mx-auto mb-auto my-3"><PlayIcon onClick={() => getMP3(text)} className="h-5 w-5 text-gray-400 hover:text-gray-500" /></button>
              <button className="hidden group-hover:block mr-0 mx-auto mb-auto my-3"><TrashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" /></button>
            </div>
            {tbElements}
          </div>
        </div>
        <div className="container mx-auto w-2/6"></div>
        <Footer />
    </div>
  </div>
  )
  
}
