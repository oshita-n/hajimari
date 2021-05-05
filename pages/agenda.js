import { useRouter } from 'next/router';
import Layout from '../src/components/Layout.js';

const Content = () => {
  const router = useRouter();
  return (
      <h1 className="mt-10 text-center text-3xl">{router.query.title}</h1>
  );
};
const Agenda = () => (
    <Layout>
        <Content />
    </Layout>
);
export default Agenda;