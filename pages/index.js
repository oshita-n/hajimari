import styles from '../styles/Home.module.css'
import { Footer } from '../src/components/Footer.js'
import { Header } from '../src/components/Header.js'


export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex justify-center mt-10 mb-10">
        <textarea id="text-form" className="border py-2 px-3  w-6/12 stext-grey-darkest resize-none overflow-hidden" rows="1" onClick={cutLine} onKeyDown={newLine2} onKeyPress={newLine}></textarea>
      </div>
      <Footer />
    </div>
  )
}

function newLine(e) {
  var tf = document.getElementById("text-form");
  console.log(e.key)
  if (e.key === "Enter") {
    tf.rows = tf.rows + 1;
    console.log(tf.rows);
  }
}

function newLine2(e) {
  var tf = document.getElementById("text-form");
  console.log(e.key)
  if (e.key === "Backspace") {
    if (tf.selectionStart === 1) {
      tf.rows = tf.rows - 1;
    }
  }
}

function cutLine(e) {
  var tf = document.getElementById("text-form");
  console.log(tf.selectionStart);
}