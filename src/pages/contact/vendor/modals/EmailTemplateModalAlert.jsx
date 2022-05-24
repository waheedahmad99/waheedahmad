import React, { useState } from 'react'
import { Form, Button, Col, Container, Modal, Row } from 'react-bootstrap'

export const EmailTemplateModalAlert = (props) => {
    const { onHide,formData,onChange,handleAddEmailTemplates } = props;
    const {name} = formData
     
    return (
        <>
            <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body className="show-grid">
                    <Container className='p-4'>
                        <Form>
                            <Row className={'m-4'}>
                                <p>Please Name the Template</p>
                                <Col xs={12} md={12} lg={12} >
                                    <input className="form-control form-control-lg" type="text" onChange={(e) => onChange(e)} value={name} id="name" placeholder="Enter Name of Template" aria-label=".form-control-lg example" />
                                </Col>
                            </Row>
                        </Form>
                        <Row className={'m-4 align-items-center'}>
                            <Col sm={12} md={8} lg={8}>
                                <Button
                                    className="shadow-1 theme-bg border border-0"
                                    style={{
                                        height: '3rem'
                                    }}
                                    onClick={()=>{handleAddEmailTemplates();onHide()}}
                                >Save</Button>
                                <button onClick={onHide} className="btn btn-ligth">Discard</button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}