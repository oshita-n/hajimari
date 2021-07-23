import Head from 'next/head'
import Link from 'next/link';

export function Header() {
    return(
    <div>
        <Head>
                <title>読み上げ太郎</title>
                <meta name="description" content="テキストを読み上げる" />
                <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mt-2 ml-5 mb-2 font-bold text-xl">
            <Link href="/">読み上げ太郎</Link>
        </div>
        <hr />
    </div>
    )
}