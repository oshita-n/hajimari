import React from "react"
import Link from 'next/link';

export default ({ children }) => (
  <div className="container mx-auto">
    {children}
    <Link href="/">戻る</Link>
  </div>
)