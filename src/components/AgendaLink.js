import { Link } from 'react-router-dom'

export default function AgendaLink(props) {
    console.log(props)
    return (
        <div>
            <h1>{props.mesage}</h1>
        </div>
    );
}
