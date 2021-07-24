import { Footer } from '../src/components/Footer.js';
import { Header } from '../src/components/Header.js';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect } from 'react';

export default function Home() {
  const [agendaMessage, setAgendaMessage] = useState("");

  const handleChange = (e) => {
    setAgendaMessage(e.target.value);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <div className="container mx-auto w-2/3">
          <div className="mt-10 mb-5">
            <TextareaAutosize id="text-form" placeholder="テキストを入力" onChange={handleChange} className="text-black outline-none py-2 px-3 resize-none overflow-hidden w-full" minRows={1}></TextareaAutosize>
            <div className="text-right">
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"  value={agendaMessage}>読み上げる</button>
              <button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">保存</button>
            </div>            
          </div>
        </div>
        <Footer />
    </div>
  </div>
  )
  
}
