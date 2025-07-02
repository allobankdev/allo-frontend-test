import React from 'react'
import { Carousel, Image, Modal } from 'react-bootstrap';
import { styles } from './style';

function ModalRocketDetail({
    showModal,
    setShowModal,
    rocketSelected
}) {

    const handleClose = () => {
        setShowModal(false);
    };

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size='lg'
            data-bs-theme='light'
        >
            <Modal.Header closeButton >
                <Modal.Title style={styles?.modalTitleStyles}>
                    Detail Rocket {rocketSelected?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mt-3'>
                    <Carousel>
                        {rocketSelected?.flickr_images?.map((imgUrl, index) => (
                            <Carousel.Item key={index} interval={3000}>
                                <Image
                                    src={imgUrl}
                                    rounded
                                    fluid
                                    style={{
                                        width: '800px',
                                        height: '520px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className='mt-3'>
                    <p style={styles?.textHeader}>
                        *Rocket full description: <span style={styles?.textContent}>{rocketSelected?.description}</span>
                    </p>
                    <p style={styles?.textHeader}>
                        *Cost per launch: <span style={styles?.textContent}>{numberFormat(rocketSelected?.cost_per_launch)}</span>
                    </p>
                    <p style={styles?.textHeader}>
                        *Location: <span style={styles?.textContent}>{rocketSelected?.country}</span>
                    </p>
                    <p style={styles?.textHeader}>
                        *First flight: <span style={styles?.textContent}>{rocketSelected?.first_flight}</span>
                    </p>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalRocketDetail
