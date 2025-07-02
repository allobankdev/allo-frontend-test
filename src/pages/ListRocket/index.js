import React, { useEffect, useState } from 'react'
import { ModalAddNewRocket, ModalRocketDetail, NavbarComponent } from '../../components'
import { styles } from './style'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Spinner } from 'react-bootstrap';
import axiosModule from '../../api/axios-module';
import Swal from 'sweetalert2';
import { FiSearch } from 'react-icons/fi';

function ListRocket() {

    const today = new Date;
    const currentYear = today.getFullYear();

    const [loading, setLoading] = useState(true);
    const [listRocket, setListRocket] = useState([]);

    const retrieveListRocket = () => {
        setLoading(true);
        axiosModule.get(`/v4/rockets`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }

            })
            .then(res => {

                setListRocket(res.data);

                setLoading(false);
            }).catch(err => {
                console.error(err);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to collect data, please try again later!',
                    showCancelButton: true,
                    confirmButtonText: 'Try Again',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                        retrieveListRocket();
                    }
                });

                setLoading(false);
            });
    };

    useEffect(() => {
        retrieveListRocket();
    }, []);

    const [searchRocketName, setSearchRocketName] = useState('');

    const filteredRocket = listRocket.filter((data) =>
        data?.name.toLowerCase().includes(searchRocketName.toLowerCase())
    );

    const highlightText = (text, highlight) => {
        if (!highlight) return text;

        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const [showModalAddRocket, setShowModaAddRocket] = useState(false);

    const handleShowModalAddRocket = () => {
        setShowModaAddRocket(true);
    }
    const [showModal, setShowModal] = useState(false);
    const [rocketSelected, setRocketSelected] = useState();
    const handleShowModal = (data) => {
        setShowModal(true);
        setRocketSelected(data);
    }

    return (
        <div style={styles?.mainContainer}>
            <NavbarComponent />
            <Container fluid style={{ position: 'relative' }}>
                <div className='pt-2' style={styles?.containerSearch}>
                    <InputGroup className="my-3">
                        <Form.Control
                            placeholder="Find with rocket name"
                            aria-label="Find with rocket name"
                            value={searchRocketName}
                            onChange={(e) => setSearchRocketName(e.target.value)}
                            style={styles?.searchFormStyles}
                        />
                        <InputGroup.Text>
                            <FiSearch size={20} />
                        </InputGroup.Text>
                    </InputGroup>
                    <Button
                        variant='btn'
                        style={styles?.buttonCardStyles}
                        onClick={handleShowModalAddRocket}
                    >
                        Add new rocket
                    </Button>
                </div>
                {searchRocketName && filteredRocket.length === 0 ? (
                    <p style={{ fontFamily: 'Poppins-Regular', color: '#222' }}>
                        There is no rocket with name: {searchRocketName}
                    </p>
                ) : (
                    <>
                        {loading ? (
                            <div
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '200px' }}
                            >
                                <Spinner animation='border' style={{ color: '#2f4b7c' }} />
                            </div>
                        ) : (
                            <>
                                <Row>
                                    {filteredRocket.map((data) => (
                                        <Col key={data?.id} xs={12} md={3} lg={3} className='text-center my-3'>
                                            <Card style={styles?.cardStyles}>
                                                <Card.Header style={styles?.cardHeaderStyles}>
                                                    <Row>
                                                        <Col className='text-start'>
                                                            <p style={styles?.textCardHeader}>{data?.type}</p>
                                                        </Col>
                                                        <Col className='text-end'>
                                                            <p style={styles?.textCardHeader}>
                                                                {highlightText(data?.name, searchRocketName)}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className='mb-3'>
                                                        {loading ? (
                                                            <div
                                                                className='d-flex justify-content-center align-items-center'
                                                                style={{ height: '200px' }}
                                                            >
                                                                <Spinner animation='border' style={{ color: '#2f4b7c' }} />
                                                            </div>
                                                        ) : (
                                                            <Image
                                                                src={data?.flickr_images[0]}
                                                                rounded
                                                                style={{
                                                                    width: '320px',
                                                                    height: '250px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p style={styles?.textContent}>
                                                            {truncateText(data?.description || '', 98)}
                                                        </p>
                                                    </div>
                                                    <div className='text-start'>
                                                        <Button
                                                            variant='btn'
                                                            style={styles?.buttonCardStyles}
                                                            onClick={() => handleShowModal(data)}
                                                        >
                                                            Details
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}
                    </>
                )}
            </Container>
            <footer style={styles?.footerStyle}>
                <p style={styles?.textFooter}>
                    © Surya Juniawan {currentYear}
                </p>
            </footer>

            <ModalAddNewRocket
                showModalAddRocket={showModalAddRocket}
                setShowModaAddRocket={setShowModaAddRocket}
                onSave={(newData) => setListRocket((prev) => [...prev, newData])}
            />

            <ModalRocketDetail
                showModal={showModal}
                setShowModal={setShowModal}
                rocketSelected={rocketSelected}
            />

        </div>
    )
}

export default ListRocket
