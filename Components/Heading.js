import { Menu } from 'semantic-ui-react';
import { Link } from '../routes.cjs';

const Heading = () => {
    return (
        <Menu style={{marginTop: '3%'}}>
                <Link route='/'>
                    <a className='item'>Crowd Coin</a>
                </Link>
            <Menu.Menu position='right'>
                <Link route='/campaigns/new'>
                    <a className='item'> + </a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
}

export default Heading;