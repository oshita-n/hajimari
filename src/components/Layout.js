import React from "react"
import Link from 'next/link';

export default ({ children }) => (
  <div className="container mx-auto">
    {children}
    
      <Link href="/">
        <a><button className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">戻る</button></a>
      </Link>
  </div>
)