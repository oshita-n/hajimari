import Head from 'next/head'
import Link from 'next/link';
export function Header() {
    return(
    <div>
        <Head>
            <title>Oto</title>
            <meta name="description" content="Freeing the Sound." />
            <link rel="icon" href="/favicon.ico" />
            <script src="https://apis.google.com/js/api.js"></script>
            <script src="https://apis.google.com/js/client.js"></script>
        </Head>
        <div className="bg-header">
            <div className="text-white pt-2 ml-5 pb-2 font-bold text-xl">
                <Link href="/">Oto</Link>
            </div>
        </div>
        <hr />
    </div>
    )
}