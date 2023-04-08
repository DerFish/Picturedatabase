import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { getEnvVariable } from '../helper';
import { generateThumbnail, generateGreyscale } from '../apiService';

export function EditPicture(props) {
    const [pictureData, setPictureData] = useState({});
    const [imageFolderPath, setImageFolderPath] = useState();
    const [apiUrl, setApiUrl] = useState();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

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

                                setLoading(false);
                            });
                    });
            });
    }, []);

    const createPropertyRows = () => {
        console.log(pictureData.exifProperties);

        var rows = [];

        for (var i = 0; i < pictureData.exifProperties.length; i++) {
            rows.push(<Form.Group controlId={pictureData.exifProperties[i].name}>
                <Form.Label>{pictureData.exifProperties[i].name}:</Form.Label>
                <Form.Control type="text" value={pictureData.exifProperties[i].value} />
            </Form.Group>);
        }

        return rows;
    }

    return loading ? <div>loading...</div> : (
        <div className="form-wrapper">
            <Form>
                <Form.Group controlId="fileName">
                    <Form.Label>Id:</Form.Label>
                    <Form.Control type="text" value={pictureData.id} disabled />
                </Form.Group>
                <Form.Group controlId="fileName">
                    <Form.Label>Filename:</Form.Label>
                    <Form.Control type="text" value={pictureData.fileName} disabled />
                </Form.Group>
                <Form.Group controlId="fileSize">
                    <Form.Label>Filesize:</Form.Label>
                    <Form.Control type="number" value={pictureData.fileSize} disabled />
                </Form.Group>
                <Form.Group controlId="fileType">
                    <Form.Label>Filetype:</Form.Label>
                    <Form.Control type="text" value={pictureData.fileType} disabled />
                </Form.Group>
                <Form.Group controlId="createDate">
                    <Form.Label>Erstelldatum:</Form.Label>
                    <Form.Control type="text" value={pictureData.createDate} disabled />
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
                {createPropertyRows()}
                <Button variant="success" size="lg" block="block" type="submit">Save</Button>
                <Link to={"/list-student"} className="btn btn-danger btn-block">Cancel</Link>
            </Form>

        </div>
    );
}