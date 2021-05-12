import React from "react"
import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import { Header } from './Header.js';

export default ({ children }) => (
  <div>
    <Header />
    <div className="container mx-auto">
      <div className="mt-10 mb-10">
        <Link href="/">
          <a><button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"><div class={ styles.triangle }></div>投稿する</button></a>
        </Link>
      </div>
      <div className="container mx-auto bg-blue-200 w-3/6 h-96 rounded py-32">
        {children}
      </div>
    </div>
  </div>
)