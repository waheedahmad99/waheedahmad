import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Badge, Tabs, Tooltip } from 'react-bootstrap';


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { GET_CHATTER } from '../../store/actions';

import { store } from '../../store/index';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { orderBy } from 'lodash'
import { Chatters, Images, Documents } from '../../services';

const Chatter = props => {

    dayjs.extend(relativeTime);
    const [chatterState, setChatterState] = useState([])
    const [allState, setAllState] = useState([])
    const [postState, setPostState] = useState({})
    const [toggle,settoggle] = useState(0)
    const [docORimg, setdocORimg] = useState(["",""])
    const [filterBy, setFilterBy] = useState({
        notes: true,
        qual: false,
        changes: false
    })

    const dispatch = useDispatch();



    const getList = async (id) => {
        const data = await Chatters.getChattersForTrust(id)
        setChatterState(data)
        dispatch({
            type: GET_CHATTER,
            payload: data
        });
    }
    useEffect(() => {
        const tmpState = []
        if (filterBy.notes) {
            tmpState.push(...chatterState.filter(chatter => chatter?.chatter_type == '2'))
        }
        if (filterBy.qual) {
            tmpState.push(...chatterState.filter(chatter => chatter.chatter_type == '1'))
        }
        if (filterBy.changes) {
            props.changes && tmpState.push(...props.changes.map(change => { return { ...change, date: change.time_stamp } }))
        }
        setAllState(orderBy(tmpState, ['date'], ['desc']))
    }, [filterBy, chatterState, props.changes])


    useEffect(() => {
        getList(props.id)
    }, [props.id,toggle])


    const uploadImage = async (formData) => {
        const data = await Images.uploadImageForContact(formData)
        console.log({ image: data })
        console.log("image uploaded")
    }
    const uploadDocument = async (formData) => {
        const data = await Documents.uploadDocument(formData)
        console.log({ document: data })
        console.log("document uploaded")

    }


    //here we are attaching the message, but also setting the inherited props so that the chatter message is available in multiple places.
    const handleEdit = (event) => {
        const { name, value } = event.target

        setPostState({
            ...postState,
            [name]: value,
            "contact_id": `${props.owner}`,
            "trust_id": props.id,
            "date": getCurrentDateTime,
            "chatter_type": "2"

        })

    }
    //you set the value above, but if you add something up there, you have to also put it in the form data so it will be passed.
    const postChatter = async (body) => {

        const bodyFormData = new FormData();
        bodyFormData.append('trust_id', body.trust_id);
        bodyFormData.append('contact_id', body.contact_id);
        bodyFormData.append('message_text', body.message_text);
        bodyFormData.append('chatter_type', body.chatter_type);
        const data = await Chatters.createChatter(bodyFormData)
        setPostState({ ...postState, 'message_text': '' })
        setChatterState([
            data,
            ...chatterState
        ])
        return data;
    }

    // This is where it's all bundled and pushed.
    const onSubmit = async() => {
        console.log("submit")
        const dta=await postChatter(postState)
        console.log(dta)
        if(docORimg[0]=="")return
        if(docORimg[0]=="i"){
            const data=docORimg[1]
            data.append('chatter_id', dta.id)
            await uploadImage(data)
            settoggle(!toggle)
            console.log("img")
            setdocORimg(["",""])
            return
        }
            const data=docORimg[1]
            data.append('chatter_id', dta.id)
            await uploadDocument(docORimg[1])
            settoggle(!toggle)
            setdocORimg(["",""])
            console.log("doc")
        }

    
    //and the date is gotten here so it can be send with the request
    const getCurrentDateTime = () => {
        return {
            now: moment().format('YYYY-DD-MM HH:mm:ss'),
        };
    }


    console.log("Chatter", postState)

    return (
        <Col md={12} lg={3} xl={3}>
            <Card>
                <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows="3" placeholder="Write your message"
                            onChange={handleEdit}
                            name="message_text"
                            value={postState.message_text}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    onSubmit()
                                }
                            }}
                        />
                    </Form.Group>
                    <div className="float-left mb-2">
                        <span style={{ color: filterBy.notes ? '#04a9f5' : '#888', padding: '0.2em', cursor: 'pointer' }}
                            onClick={() => setFilterBy({ ...filterBy, notes: !filterBy.notes })}
                        >Notes</span>
                        <span style={{ color: filterBy.qual ? '#04a9f5' : '#888', padding: '0.2em', cursor: 'pointer' }}
                            onClick={() => setFilterBy({ ...filterBy, qual: !filterBy.qual })}
                        >Qual</span>
                        <span style={{ color: filterBy.changes ? '#04a9f5' : '#888', padding: '0.2em', cursor: 'pointer' }}
                            onClick={() => setFilterBy({ ...filterBy, changes: !filterBy.changes })}
                        >Changes</span>
                    </div>
                    <div className="float-right mb-2"

                    >
                        <OverlayTrigger overlay={<Tooltip>Attach a File</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paperclip f-20 mr-2"
                                onClick={() => {
                                    document.querySelector('.chatter-upload-file').click()
                                }}

                                onChange={(event) => {
                                    console.log(event.target.files[0])
                                }}
                            />
                        </OverlayTrigger>
                        <Form.Control
                            type="file"
                            style={{ display: 'none' }}
                            className="chatter-upload-file"
                            onChange={(e) => {

                                let imageExtension = ["jpg", "png", "gif", "bmp", "jpeg", "JPG", "PNG", "GIF", "BMP", "JPEG", "HEIF", "heif", "HEIC", "heic"]
                                for (let file of e.target.files) {
                                    const fd = new FormData()
                                    fd.append('name', file.name)
                                    if (imageExtension.includes(file.type.split('\/')[1].toLowerCase())) {
                                        fd.append('photo', file)
                                        fd.append("contact_id", props.owner)
                                        // uploadImage(fd)
                                        setdocORimg(["i",fd])
                                        console.log('image uploaded')
                                    } else {
                                        fd.append('file', file)
                                        fd.append("contact_id", props.owner)
                                        // uploadImage(fd)
                                        setdocORimg(["d",fd])
                                        console.log('document uploaded')
                                    }
                                }
                                console.log({ files: e.target.files })
                            }
                            }
                        />
                        <OverlayTrigger overlay={<Tooltip>Send</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paper-plane text-c-blue f-20 mr-2"
                                onClick={onSubmit}
                            />
                        </OverlayTrigger>
                    </div>
                    <br />
                    {allState &&
                        <>
                            <ul className="task-list">
                                {allState.map(data => (
                                    <li key={data.id}>
                                        {data.chatter_image.length > 0 || data.chatter_doc.length > 0 ?
                                            <a href={data.chatter_image.length > 0 ? data.chatter_image[0].photo : data.chatter_doc[0].file} download>{data.chatter_image.length > 0 ? data.chatter_image[0].name : data.chatter_doc[0].name}</a>
                                            :
                                            <p>No Attachments!</p>
                                        }
                                        <i className="task-icon bg-c-green" />
                                        <h6>
                                            <p className="text-muted">{moment(data.date || data.time_stamp).format('l LT')}<Badge className="float-right text-white f-11 theme-bg2">Username</Badge></p>
                                        </h6>
                                        {data.message_text && <p>{data.message_text.replace(/(?:\r\t|\r\t)/g, '\n')}</p>}
                                        {data.changed_field && <p>Changed Field: {data.changed_field}</p>}
                                        {data.old_value && <p>Old Value: {data.old_value}</p>}
                                        {data.new_value && <p>New Value: {data.new_value}</p>}
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}

export default Chatter;