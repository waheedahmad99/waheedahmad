import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
// =>Import Files here
import { EmailTemplateModalAlert } from './EmailTemplateModalAlert'
import "../../../../index.css";

//=> Email Services
import emailServices from '../../../../services/emailServices'
import httpService from '../../../../services/httpService';

export const EmailTemplateModal = (props) => {
    const [documentButton, setDocumentButton] = useState(true);
    const { onHide, countRows, emailTemplateVariablesNames } = props;
    //EmailTemplateModalAlert States
    const [modalShowAlert, setModalShowAlert] = useState(false);
    //handle Template name and its keys
    const [getTemplateData, setTemplateData] = useState([]);
    console.log(getTemplateData)
    const [TemplateName, setTemplateName] = useState(null);
    const [SubtemplateDetails, setSubtemplateDetails] = useState("");
    const [body, setBody] = useState("");
    const intialValues = { name: "", body: "", subject: "", template_type: "email" }
    const [formData, setFormData] = useState(intialValues);


   
    //getTemplateNames
    const getTemplateName = async () => {
        const source = httpService.getSource();
        const templates = await emailServices.getEmailtemplate(source)
        // console.log(templates)
        setTemplateData(templates.results);
    }
     //USeEffect for get template
     useEffect(() => {
        getTemplateName()
    }, []);

    const onChange = (e) => {
        const { value, id } = e.target
        setBody(value)
        setFormData({ ...formData, [id]: value })
        setSubtemplateDetails("")
    }
    // =>Email Template Add Data
    const handleAddEmailTemplates = async () => {
        await emailServices.addEmailtemplate(formData)
        setFormData(intialValues)
        onHide();

    }
    

    return (
        <>

            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>

                <Modal.Body className="show-grid">
                    <Container>
                        <Row className={'my-2'}>
                            <Col xs={12} >
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
  <li class="nav-item" role="presentation">
    <Button class="nav-link shadow-1 theme-bg border border-0 active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Document</Button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link shadow-1 theme-bg border border-0" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Email</button>
  </li>
  <li class="nav-item" role="presentation">
    <Button class="nav-link shadow-1 theme-bg border border-0" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">SMS</Button>
  </li>
</ul>
                                <Button className="shadow-1 theme-bg border border-0  active"
                                    style={{
                                        height: '3rem'
                                    }}
                                    onClick={() => setDocumentButton(false)}
                                >
                                    Document </Button>
                                <Button className="shadow-1 theme-bg border border-0"
                                    style={{
                                        height: '3rem'
                                    }}
                                    onClick={() => setDocumentButton(true)}
                                >
                                    Email </Button>
                                <Button className="shadow-1 theme-bg border border-0"
                                    style={{
                                        height: '3rem'
                                    }}
                                    onClick={() => setDocumentButton(true)}
                                >
                                    SMS </Button>
                                <Button className="shadow-1 theme-bg border border-0"
                                    style={{
                                        height: '3rem'
                                    }}
                                    onClick={() => setDocumentButton(true)}
                                >
                                    Snail </Button>
                            </Col>
                        </Row>

                        <Row className={'my-2'}>
                            <Col xs={12} md={4} lg={4} >
                                <select className="form-select form-select-sm bg-light" aria-label=".form-select-sm " id='template_type' onChange={onChange}>
                                    <option selected>Select A template</option>
                                    {
                                        getTemplateData?.map((templateData) => (
                                            <option value={templateData.template_type}>{templateData.name+"-"+templateData.template_type}</option>
                                        ))
}



                                </select>
                            </Col>
                            {
                                documentButton && <Col xs={12} md={8} lg={8} >
                                    <input className="form-control form-control-sm" type="text" placeholder="Subject" id='subject' value={formData.subject} onChange={onChange} aria-label=".form-control-sm example" />
                                </Col>
                            }

                        </Row>
                        <Row className={'my-2 email_textArea'}>
                            <Col xs={12} md={12} lg={12}>
                                <textarea className="form-control" placeholder="Leave a comment here" rows={12} id='body' onChange={onChange} value={`${formData.body + SubtemplateDetails}`}></textarea>
                            </Col>
                            <Row className="select_template align-items-center">
                                <Col sm={12} md={4} lg={4}>
                                    <ul class="emailTemplateModal">
                                        <li><a>Insert a variable</a>
                                            <ul>
                                                {
                                                    Object?.keys(emailTemplateVariablesNames)
                                                        ?.map((templateNames, index) => (

                                                            <li onMouseMove={() => setTemplateName(templateNames)}><a>{templateNames}</a>

                                                                <ul className="ello">
                                                                    {

                                                                        emailTemplateVariablesNames[TemplateName]?.map((subtemplateDetails) => (
                                                                            <li ><a onClick={() => setSubtemplateDetails(`&&${TemplateName + "." + subtemplateDetails}&&`)}>{subtemplateDetails}</a></li>
                                                                        )

                                                                        )
                                                                    }


                                                                </ul>
                                                            </li>

                                                        ))
                                                }
                                            </ul>
                                        </li>
                                    </ul>
                                </Col>
                                <Col sm={12} md={8} lg={8} className={"text-end"}>
                                    <EmailTemplateModalAlert show={modalShowAlert} onHide={() => setModalShowAlert(false)} countRows={countRows} formData={formData} onChange={onChange} handleAddEmailTemplates={handleAddEmailTemplates} />
                                    {/* //EmailTemplateModalAlert */}
                                    <button onClick={() => setModalShowAlert(true)} className="btn btn-ligth">Save as Template</button>

                                </Col>
                            </Row>
                        </Row>

                        <Row className={'my-2 align-items-center'}>
                            <Col sm={12} md={8} lg={8}>
                                <Button onClick={onHide}
                                    className="shadow-1 theme-bg border border-0"
                                    style={{
                                        height: '3rem'
                                    }}
                                > Send</Button>
                                <button onClick={onHide} className="btn btn-ligth">Discard</button>
                            </Col>
                            <Col sm={12} md={4} lg={4} className={"text-end"}>
                                <p><span>{countRows}</span> Contacts Selected</p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>


        </>
    )
}