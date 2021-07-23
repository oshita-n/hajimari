import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect } from 'react';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

export default function Home() {

  const client = new textToSpeech.TextToSpeechClient();

  const [agendaMessage, setAgendaMessage] = useState("");

  const handleChange = (e) => {
    setAgendaMessage(e.target.value);
  };

  async function quickStart() {
    // Construct the request
    const request = {
      input: {text: agendaMessage},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'ja-JP', ssmlGender: 'MALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <TextareaAutosize id="text-form" placeholder="テキストを入力" onChange={handleChange} className="text-black outline-none py-2 px-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize>
            <div className="text-right">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded" onClick={quickStart} value={agendaMessage}>読み上げる</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">保存</button>
            </div>            
          </div>
        </div>
        <Footer />
    </div>
  </div>
  )
  
}
