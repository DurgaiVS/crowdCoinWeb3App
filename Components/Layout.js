import { Container } from 'semantic-ui-react';
import Heading from './Heading.js';

const Layout = ({ children }) => {
    return (
        <Container>
            <Heading />
            { children }
            <link async rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css" />
        </Container>
    )
}

export default Layout;