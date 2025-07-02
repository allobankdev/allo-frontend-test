import React from 'react'
import { NavbarComponent } from '../../components'
import { styles } from './style'
import { Container } from 'react-bootstrap'

function Home() {

    const today = new Date;
    const currentYear = today.getFullYear();

    return (
        <div style={styles?.mainContainer}>
            <NavbarComponent />
            <Container fluid style={{ position: 'relative', ...styles.backgroundHero }}>
                <div style={styles.overlay}></div>
                <div style={styles.heroContent}>
                    <h1 style={styles?.textHeader}>Welcome to OrbitalSpecs</h1>
                    <h5 style={styles?.textContent}>This site is for viewing the types of rockets and their details. </h5>
                </div>
            </Container>
            <footer style={styles?.footerStyle}>
                <p style={styles?.textFooter}>
                    © Surya Juniawan {currentYear}
                </p>
            </footer>
        </div>
    )
}

export default Home
