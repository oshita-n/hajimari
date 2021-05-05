import Link from 'next/link';
const AgendaLink = props => (
    <Link href={`/agenda?title=${props.message}`}>
      <a className="hover:text-gray-500 mt-3 text-xl text-gray-400 whitespace-pre-wrap">{props.message}</a>
    </Link>
);
export default AgendaLink