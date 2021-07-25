import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function Home() {

  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // setTimeoutの第一引数の関数として簡略化できる
      }, ms)
    });
  }

  async function getMP3(){
    await execute()
  }
  function createMP3Base64(base64, name) {
    if (process.browser) {
      // base64のデコード
      var bin = window.atob(base64["result"]["audioContent"].replace(/^.*,/, ''));
    }
    // バイナリデータ化
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // ファイルオブジェクト生成(この例ではjpegファイル)
    return new File([buffer.buffer], name, {type: "audio/mpeg"});
};

  function loadClient() {
    if (process.browser) {
      window.gapi.client.setApiKey(process.env.NEXT_PUBLIC_API_KEY);
      return window.gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1")
          .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
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
                      console.log("Response", response);
                      saveAs(createMP3Base64(response, "response.mp3"), "response.mp3")
                      var audioElem = new Audio();
                      audioElem.src = "response.mp3";
                      audioElem.play();
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
  const [agendaMessage, setAgendaMessage] = useState("");
  
  useState(() => {
    wait(1000)
    loadClient()
   })
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
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" onClick={getMP3} value={agendaMessage}>読み上げる</button>
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
