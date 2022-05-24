import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import Datetime from 'react-datetime';
import moment from 'moment';
import { Situations, Trusts } from '../../../services';


import { Typeahead, Input } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { Bills, Contacts } from '../../../services';
import httpService from '../../../services/httpService';
const TrustSit = props => {
    const [isLarge, setIsLarge] = useState(false);
    const [taxState, setTaxtate] = useState({});
    const [taxOptionsState, setTaxOptionsState] = useState({});
    const [selected, setSelected] = useState([]);
    const [entitiesState, setEntitiesState] = useState([]);

    const [allContacts, setAllContacts] = useState([])
    const [billOptions, setBillOptions] = useState([])
    const choices1 = [
        {
            "value": "1",
            "display_name": "Insurance"
        },
        {
            "value": "2",
            "display_name": "Code Violation"
        },
        {
            "value": "3",
            "display_name": "Family Situation"
        },
        {
            "value": "4",
            "display_name": "Property Situation"
        },
        {
            "value": "5",
            "display_name": "Evictions"
        },
        {
            "value": "6",
            "display_name": "Legal"
        },
        {
            "value": "7",
            "display_name": "Need to Sell"
        },
        {
            "value": "8",
            "display_name": "Other"
        }
    ]
    useEffect(() => {
        // representation of the numbers 27 for investor, 26 for family, 28 for Equity & Help Inc and 29 for others
        const filtermethod = (type) => {
            if (type == '27') {
                return 'investor_bool'
            }
            else if (type == '26' || type == '1') {
                return 'family_bool'
            }
        }

        if (taxState.bill_choice == "29") {
            setEntitiesState(allContacts)
            setSelected([])
        }
        else if (taxState.bill_choice == '28') {
            const contact = allContacts.filter(contact => contact.id == 48)
            setEntitiesState(contact)
            setSelected(contact)
            // setTaxtate({...taxState,bill_choice:48})
        }
        else {
            setSelected([])
            const name = filtermethod(taxState.bill_choice)
            const data = allContacts.filter(contact => contact[name])
            setEntitiesState(data)
        }

    }, [taxState.bill_choice, allContacts])

    const getOptions = async () => {
        const data = await Bills.getOptions()
        let options = data.actions.POST.bill_choice.choices
        setBillOptions(options.filter(option => ["E&H Payment", "Family Payment", "Investor Payment", "Other"].includes(option.display_name)))
        // setTaxOptionsState(data.actions.POST)

    }

    // const handleNewSits = async(id) => {
    //     // console.log("New Line Created For Trust Id", props.id)
    //     const obj = {};
    //     obj["trust_id"] = props.id
    //     obj["issue"] = "Some Issue"
    //     obj["notes"] = "Some Notes"
    //     obj["situation_type"] = "Some Situation"
    //     obj["related_entity_name"] = "Some Name"


    //     const data=await Situations.createSits(obj)
    //    if(data) setSitsRowData(prevState=>[data,...prevState])
    // }


    const CreateTaxShip = async (body) => {
        console.log(body)
        const data = await Bills.createBill(body)
        props.setToggle(!props.toggle)
    }

    const handleDates = (event, name) => {
        setTaxtate({
            ...taxState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    const handleEdit = (event) => {
        const { name, value } = event.target
        console.log('name', name, 'value', value)
        setTaxtate({
            ...taxState,
            [name]: value
        })
    }


    const handleValueChange = (event, name) => {
        const value = event.value
        setTaxtate({
            ...taxState,
            [name]: value
        })
    }
    useEffect(() => {
        setAllContacts(Object.values(props.contactList))
    }, [props.contactList])

    useEffect(() => {

        getOptions()
        // getEntities()
    }, [props.trust])

    useEffect(() => {
        console.log(taxState)
    }, [taxState])

    const onSubmit = () => {
        const obj = {
            address: taxState.address,
            all_todos_complete: false,
            completed_date: null,
            create_date: "",
            handled: taxState.handled,
            investor_id: null,
            investor_name: "SAAAAD",
            issue: taxState.issue,
            last_completed_todo_date: taxState.last_completed_todo_date,
            last_completed_todo_employee: null,
            last_completed_todo_id: "1",
            last_completed_todo_title: null,
            next_todo_employee: taxState.next_todo_employee,
            next_todo_id: null,
            next_todo_status: null,
            next_todo_title: taxState.next_todo_title,
            notes: taxState.notes,
            related_entity_id: null,
            related_entity_name: null,
            situation_type: taxState.situation_type,
            tag_ids: [],
            trust_id: props.id,
            trust_name: taxState.trust,
            updated_on: "",
            user: "admin@equityandhelp.com Hjelseth"
        }
        Situations.createSits(obj)
        console.log(taxState)
        props.setToggle(!props.toggle);
        setTaxtate({})
        setIsLarge(false)
    }

    return (
        <React.Fragment>
            <OverlayTrigger overlay={<Tooltip>Add tax funds to this Trust</Tooltip>} style={{ float: "right" }}>
                <Button className="shadow-1 theme-bg border border-0" size="sm" onClick={() => setIsLarge(true)}>
                    Add a Row
                </Button>
            </OverlayTrigger>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add a Row to Situation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Address</Form.Label>
                            <Col>
                                <Form.Control
                                    name="address"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Issue</Form.Label>
                            <Col>
                                <Form.Control
                                    name="issue"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Handled</Form.Label>
                            <Col>
                                <input
                                    onChange={(e) => {
                                        setTaxtate({
                                            ...taxState,
                                            "handled": e.target.checked
                                        })
                                    }}
                                    type='checkbox'></input>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Trust</Form.Label>
                            <Col>
                                <Typeahead
                                    id="full_name"
                                    name="trust"
                                    labelKey="full_name"
                                    onChange={(entity) => {
                                        entity && handleEdit({ target: { name: 'trust', value: entity[0].id } })
                                        setSelected(entity)
                                    }
                                    }
                                    options={entitiesState}
                                    placeholder="Choose an entity..."
                                    selected={selected}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Investor</Form.Label>
                            <Col>
                                <Form.Control
                                    name="investor"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Situation Type</Form.Label>
                            <Col>
                                <Form.Control
                                    name="situation_type"
                                    onChange={handleEdit}
                                    as="select">
                                    <option value="">Select a situation type</option>
                                    {choices1.map((choice, index) => {
                                        return <option key={index} value={choice.value}>{choice.display_name}</option>
                                    })}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Related Entity</Form.Label>
                            <Col>
                                <Form.Control
                                    name="related_entity_id"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Next todo</Form.Label>
                            <Col>
                                <Form.Control
                                    name="next_todo_title"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Next Assigned</Form.Label>
                            <Col>
                                <Form.Control
                                    name="next_todo_employee"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Notes</Form.Label>
                            <Col>
                                <Form.Control
                                    name="notes"
                                    onChange={handleEdit}
                                    as="input">

                                </Form.Control>

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label className={"mb-n5"} column xs={4} md={3}>Last Completed</Form.Label>
                            <Col>
                            <Datetime
                                dateFormat="MM/DD/YYYY"
                                closeOnSelect={true}
                                timeFormat={false}
                                name="date_received"
                                onChange={event => handleDates(event, "last_completed_todo_date")} />

                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col className="float-right">
                            <div className="float-right" style={{ display: "flex" }}>
                                <OverlayTrigger overlay={<Tooltip>Discard Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" onClick={() => setIsLarge(false)}>
                                        Cancel
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Save Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" onClick={onSubmit}>
                                        Save
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};


const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList
})
export default connect(mapStateToProps, null)(TrustSit)
