import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { styles } from './style';

function ModalAddNewRocket({
    showModalAddRocket,
    setShowModaAddRocket,
    onSave
}) {

    const handleClose = () => {
        setShowModaAddRocket(false);
        setBoosters('');
        setCompany('SpaceX' || '');
        setCostLaunch('');
        setCountry('');
        setDescription('');
        setDiameterMeters('');
        setDiameterFeet('');
        setFirstFlight('');
        setFirstStage('');
        setFlickrImages('');
        setHeightMeters('');
        setHeightFeet('');
        setLandingLegsNumber('');
        setLandingLegsMaterial('');
        setMassKg('');
        setMassLb('');
        setName('');
        setStages('');
        setSuccessRate('');
        setType('rocket' || '');
        setWikipediaLink('');
    };

    const [boosters, setBoosters] = useState('');
    const [company, setCompany] = useState('SpaceX' || '');
    const [costLaunch, setCostLaunch] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [diameterMeters, setDiameterMeters] = useState('');
    const [diameterFeet, setDiameterFeet] = useState('');
    const [firstFlight, setFirstFlight] = useState('');
    const [firstStage, setFirstStage] = useState('');
    const [flickrImages, setFlickrImages] = useState('');
    const [heightMeters, setHeightMeters] = useState('');
    const [heightFeet, setHeightFeet] = useState('');
    const [landingLegsNumber, setLandingLegsNumber] = useState('');
    const [landingLegsMaterial, setLandingLegsMaterial] = useState('');
    const [massKg, setMassKg] = useState('');
    const [massLb, setMassLb] = useState('');
    const [name, setName] = useState('');
    const [stages, setStages] = useState('');
    const [successRate, setSuccessRate] = useState('');
    const [type, setType] = useState('rocket' || '');
    const [wikipediaLink, setWikipediaLink] = useState('')


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    const handleFormSubmit = (e) => {

        e.preventDefault();


        const newData = {
            active: true,
            boosters: boosters,
            company: company,
            cost_per_launch: costLaunch,
            country: country,
            description: description,
            diameter: { meters: diameterMeters, feet: diameterFeet },
            first_flight: firstFlight,
            first_stage: firstStage,
            flickr_images: [flickrImages],
            height: { meters: heightMeters, feet: heightFeet },
            landing_legs: { number: landingLegsNumber, material: landingLegsMaterial },
            mass: { kg: massKg, lb: massLb },
            name: name,
            stages: stages,
            success_rate_pct: successRate,
            type: type,
            wikipedia: wikipediaLink
        };

        onSave(newData);

        setBoosters('');
        setCompany('SpaceX' || '');
        setCostLaunch('');
        setCountry('');
        setDescription('');
        setDiameterMeters('');
        setDiameterFeet('');
        setFirstFlight('');
        setFirstStage('');
        setFlickrImages('');
        setHeightMeters('');
        setHeightFeet('');
        setLandingLegsNumber('');
        setLandingLegsMaterial('');
        setMassKg('');
        setMassLb('');
        setName('');
        setStages('');
        setSuccessRate('');
        setType('rocket' || '');
        setWikipediaLink('');

        handleClose();

    };

    function handleChangeCostLaunch(e) {
        const inputValue = e.target.value;
        const numericValue = parseFloat(inputValue.replace(/[^\d]/g, '')) || 0;

        setCostLaunch(numericValue);
    };

    return (
        <Modal
            show={showModalAddRocket}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size='lg'
            data-bs-theme='light'
        >
            <Modal.Header closeButton >
                <Modal.Title style={styles?.modalTitleStyles}>
                    Add New Rocket
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Row>
                        <p style={styles?.textContentForm}>*Rocket details</p>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="name">Rocket Name* </Form.Label>
                                <Form.Control
                                    id="name"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="type">Rocket Type* </Form.Label>
                                <Form.Control
                                    id="type"
                                    type="text"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="company">Rocket Company* </Form.Label>
                                <Form.Control
                                    id="company"
                                    type="text"
                                    onChange={(e) => setCompany(e.target.value)}
                                    value={company}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="country">Rocket Location* </Form.Label>
                                <Form.Control
                                    id="country"
                                    type="text"
                                    onChange={(e) => setCountry(e.target.value)}
                                    value={country}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="image">Rocket Flickr Image Link* </Form.Label>
                                <Form.Control
                                    id="image"
                                    type="text"
                                    onChange={(e) => setFlickrImages(e.target.value)}
                                    value={flickrImages}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="wikipedia">Wikipedia Link* </Form.Label>
                                <Form.Control
                                    id="wikipedia"
                                    type="text"
                                    onChange={(e) => setWikipediaLink(e.target.value)}
                                    value={wikipediaLink}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="firstFlight">First Flight* </Form.Label>
                                <Form.Control
                                    id="firstFlight"
                                    type="date"
                                    onChange={(e) => setFirstFlight(e.target.value)}
                                    value={firstFlight}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="firstStages">First Stages* </Form.Label>
                                <Form.Control
                                    id="firstStages"
                                    type="date"
                                    onChange={(e) => setFirstStage(e.target.value)}
                                    value={firstStage}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="booster">Rocket Boosters* </Form.Label>
                                <Form.Control
                                    id="booster"
                                    type="number"
                                    onChange={(e) => setBoosters(e.target.value)}
                                    value={boosters}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="stages">Stages* </Form.Label>
                                <Form.Control
                                    id="stages"
                                    type="number"
                                    onChange={(e) => setStages(e.target.value)}
                                    value={stages}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="successRate">Success Rate* </Form.Label>
                                <Form.Control
                                    id="successRate"
                                    type="number"
                                    onChange={(e) => setSuccessRate(e.target.value)}
                                    value={successRate}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="costPerLaunch">Cost per Launch* </Form.Label>
                                <Form.Control
                                    id="costPerLaunch"
                                    type="text"
                                    onChange={handleChangeCostLaunch}
                                    value={`$ ${costLaunch ? costLaunch.toLocaleString('eng-US') : '0,00'}`}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <p style={styles?.textContentForm}>*Rocket spesifications</p>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="diameter">Diameters* </Form.Label>
                                <Form.Control
                                    id="diameter"
                                    type="number"
                                    className='mb-3'
                                    onChange={(e) => setDiameterMeters(e.target.value)}
                                    value={diameterMeters}
                                    style={styles.inputForm}
                                    placeholder='Meters'
                                    required
                                />
                                <Form.Control
                                    id="diameter"
                                    type="number"
                                    onChange={(e) => setDiameterFeet(e.target.value)}
                                    value={diameterFeet}
                                    style={styles.inputForm}
                                    placeholder='Feet'
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="height">Height* </Form.Label>
                                <Form.Control
                                    id="height"
                                    type="number"
                                    className='mb-3'
                                    onChange={(e) => setHeightMeters(e.target.value)}
                                    value={heightMeters}
                                    style={styles.inputForm}
                                    placeholder='Meters'
                                    required
                                />
                                <Form.Control
                                    id="height"
                                    type="number"
                                    onChange={(e) => setHeightFeet(e.target.value)}
                                    value={heightFeet}
                                    style={styles.inputForm}
                                    placeholder='Feet'
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="landingaLeg">Landing Legs* </Form.Label>
                                <Form.Control
                                    id="landingaLeg"
                                    type="text"
                                    className='mb-3'
                                    onChange={(e) => setLandingLegsMaterial(e.target.value)}
                                    value={landingLegsMaterial}
                                    style={styles.inputForm}
                                    placeholder='Landing Leg Material'
                                    required
                                />
                                <Form.Control
                                    id="landingaLeg"
                                    type="number"
                                    onChange={(e) => setLandingLegsNumber(e.target.value)}
                                    value={landingLegsNumber}
                                    style={styles.inputForm}
                                    placeholder='Landing Leg Number'
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="mass">Mass* </Form.Label>
                                <Form.Control
                                    id="mass"
                                    type="number"
                                    className='mb-3'
                                    onChange={(e) => setMassKg(e.target.value)}
                                    value={massKg}
                                    style={styles.inputForm}
                                    placeholder='Mass Kg'
                                    required
                                />
                                <Form.Control
                                    id="mass"
                                    type="number"
                                    onChange={(e) => setMassLb(e.target.value)}
                                    value={massLb}
                                    style={styles.inputForm}
                                    placeholder='Mass Lb'
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={12}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.labelForm} htmlFor="description">Rocket Description* </Form.Label>
                                <Form.Control
                                    id="description"
                                    as='textarea'
                                    rows={4}
                                    className='mb-3'
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    style={styles.inputForm}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div>
                        <Button
                            type='submit'
                            variant='btn'
                            style={styles?.buttonCardStyles}
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddNewRocket
