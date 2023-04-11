import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { getEnvVariable } from '../helper';
import { generateThumbnail, generateGreyscale } from '../apiService';
import { WithContext as ReactTags } from 'react-tag-input';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import $ from 'jquery';
import './Tags.css';

export function EditPicture(props) {
    const [pictureData, setPictureData] = useState({});
    const [imageFolderPath, setImageFolderPath] = useState();
    const [suggestions, setSuggestions] = useState([]);
    const [exifRows, setExifRows] = useState([]);
    const [apiUrl, setApiUrl] = useState();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const KeyCodes = {
        comma: 188,
        enter: 13
    };

    const [tags, setTags] = React.useState([
    ]);

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };

    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    useEffect(() => {
        setLoading(true);

        getEnvVariable("REACT_APP_IMAGEFOLDERPATH").
            then((data) => {
                setImageFolderPath(data + '/');

                getEnvVariable("REACT_APP_API")
                    .then((data) => {
                        setApiUrl(data);

                        fetch(
                            data + "getPictureInfo?id=" + id
                        )
                            .then((resp) => {
                                console.log(resp);
                                return resp.json();
                            })
                            .catch((err) => {
                                console.log("error");
                                console.log(err);
                            })
                            .then((dataa) => {
                                console.log(dataa);
                                setPictureData(dataa);
                                setTags(dataa.tags);
                                createPropertyRows(dataa);
                                setLoading(false);
                            });

                        fetch(
                            data + "getTags"
                        )
                            .then((resp) => {
                                console.log(resp);
                                return resp.json();
                            })
                            .catch((err) => {
                                console.log("error");
                                console.log(err);
                            })
                            .then((dataa) => {
                                setSuggestions(dataa);
                            });
                    });
            });
    }, []);

    const createPropertyRows = (data) => {
        console.log(data);

        if (data.exifProperties == undefined) {
            return <div></div>;
        }

        var rows = [];

        for (var i = 0; i < data.exifProperties.length; i++) {
            rows.push(createExifPropertyInputRow(i, data.exifProperties[i].name, data.exifProperties[i].value));
        }

        setExifRows(rows);
    }

    const removeExifProperty = (no) => {
        $('#mainForm').find('*[data-no="' + no + '"]').remove();
    }

    const createExifPropertyInputRow = (no, name, value) => {
        return <Row className="exifDataRow" data-no={no}><Form.Group controlId={no} as={Col} style={{ marginBottom: 20 + 'px' }}  >
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" defaultValue={name} className="exifDataName" />
        </Form.Group>
            <Form.Group controlId={no} as={Col} >
                <Form.Label>Wert:</Form.Label>
                <Form.Control type="text" defaultValue={value} className="exifDataValue" />
            </Form.Group>
            <Button onClick={() => { removeExifProperty(no) }} as={Col} style={{ margin: 30 + 'px' }} >-</Button>

        </Row>
    }

    const addExifPropertyInput = () => {
        let newRow = createExifPropertyInputRow(exifRows.length, "", "");
        setExifRows(prevRows => [...prevRows, newRow]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submit");

        var exifProperties = [];
        $('#mainForm').find('.exifDataRow').each(function (i, obj) {
            var name = $(obj).find('.exifDataName').val();
            var val = $(obj).find('.exifDataValue').val();

            exifProperties.push({ name: name, value: val });
        });

        var pictureData = {
            id: $('#mainForm').find('input[name="id"]').val(),
            fileName: $('#mainForm').find('input[name="fileName"]').val(),
            fileSize: $('#mainForm').find('input[name="fileSize"]').val(),
            fileType: $('#mainForm').find('input[name="fileType"]').val(),
            createDate: $('#mainForm').find('input[name="createDate"]').val(),
            exifProperties: exifProperties,
            tags: tags
        };

        console.log(pictureData);

        fetch(
            apiUrl + 'editPicture'
            , {
                method: 'POST',
                body: JSON.stringify(pictureData),
            })
            .then((resp) => {
                console.log(resp);
                window.locatio.reload();
            });
    }

    return loading ? <div>loading...</div> : (

        <div className="form-wrapper">
            <h3>Datei-Informationen</h3>
            <Form onSubmit={(event) => handleSubmit(event)} id="mainForm" >
                <Form.Group controlId="fileName">
                    <Form.Label>Id:</Form.Label>
                    <Form.Control type="text" value={pictureData.id} name="id" disabled />
                </Form.Group>
                <Form.Group controlId="fileName">
                    <Form.Label>Filename:</Form.Label>
                    <Form.Control type="text" value={pictureData.fileName} name="fileName" disabled />
                </Form.Group>
                <Form.Group controlId="fileSize">
                    <Form.Label>Filesize:</Form.Label>
                    <Form.Control type="number" value={pictureData.fileSize} name="fileSize" disabled />
                </Form.Group>
                <Form.Group controlId="fileType">
                    <Form.Label>Filetype:</Form.Label>
                    <Form.Control type="text" value={pictureData.fileType} name="fileType" disabled />
                </Form.Group>
                <Form.Group controlId="createDate">
                    <Form.Label>Erstelldatum:</Form.Label>
                    <Form.Control type="text" value={pictureData.createDate} name="createDate" disabled />
                </Form.Group>
                <Form.Group controlId="picture">
                    <Form.Label>Picture:</Form.Label>
                    <img className="img-fluid"
                        src={`${imageFolderPath}${pictureData.id}\\main.jpg`}
                        alt="logo" />
                </Form.Group>
                <Form.Group controlId="picture">
                    <Form.Label>Greyscale:</Form.Label>
                    <img className="img-fluid"
                        src={`${imageFolderPath}${pictureData.id}\\greyscale.jpg`}
                        alt="logo" />
                    <Button onClick={(e) => generateGreyscale(pictureData.id)
                        .then(() => alert('Generiert!'))} >Generieren</Button>
                </Form.Group>
                <Form.Group controlId="picture">
                    <Form.Label>Thumbnail:</Form.Label>
                    <img className="img-fluid"
                        src={`${imageFolderPath}${pictureData.id}\\thumbnail.jpg`}
                        alt="logo" />
                    <Button onClick={(e) => generateThumbnail(pictureData.id).then(() => alert('Generiert!'))}>Generieren</Button>
                </Form.Group>
                <hr>
                </hr>
                <h3>Tags</h3>
                <div>
                    <ReactTags
                        tags={tags}
                        delimiters={delimiters}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        inputFieldPosition="inline"
                        suggestions={suggestions}
                        minQueryLength="1"
                        allowUnique="true"
                        autocomplete
                    />
                </div>

                <hr>
                </hr>
                <h3>Exif/Metadaten</h3>
                {exifRows.length == 0 ? <div></div> : exifRows}
                <Button onClick={() => addExifPropertyInput()} >+</Button>
                <br></br>
                <br></br>
                <Button variant="success" size="lg" block="block" type="submit">Save</Button>
                <Link to={"/PictureOverview"} style={{ margin: 10 + 'px' }} className="btn btn-danger btn-block">Cancel</Link>
            </Form>

        </div>
    );
}