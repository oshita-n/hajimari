import Head from 'next/head'
import Link from 'next/link';

export function Header() {
    return(
    <div>
        <Head>
                <title>Hajimari</title>
                <meta name="description" content="熱いトークから始まる人生がある" />
                <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mt-2 ml-5 mb-2 font-bold text-xl">
            <Link href="/">Hajimari</Link>
        </div>
        <hr />
    </div>
    )
}