import { useRouter } from 'next/router';
import Layout from '../src/components/Layout.js';

export default function Agenda(props) {
    console.log(props)
    const router = useRouter();
    return (
        <div>
            <Layout>
                <h1 className="mt-10 text-center text-3xl">{props.message}</h1>
            </Layout>
        </div>
    );
}