import { HeroImage } from "../../assets/images/image";

export const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    textHeader: {
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },
    textContent: {
        fontFamily: 'Poppins-Regular',
        color: 'white',
    },
    textFooter: {
        paddingTop: '20px',
        fontFamily: 'Poppins-Regular',
        color: 'rgb(175, 175, 175)',
    },
    backgroundHero: {
        backgroundImage: `url(${HeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0
    },
    heroContent: {
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    footerStyle: {
        backgroundColor: 'rgb(71, 71, 71)',
        color: 'white',
        textAlign: 'center',
        padding: '0.5rem',
        marginTop: 'auto'
    },

}