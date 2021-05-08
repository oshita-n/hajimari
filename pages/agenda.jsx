import { useRouter } from 'next/router';
import Layout from '../src/components/Layout.js';

export default function Agenda() {
    const router = useRouter();
    console.log(router.query);
    return (
        <div>
            <Layout>
                <h1 className="mt-10 text-center text-3xl">{router.query.message}</h1>
            </Layout>
        </div>
    );
}