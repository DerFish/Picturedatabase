import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

export function EditPicture(props) {
    const [pictureData, setPictureData] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(
            "https://localhost:32774/getPictureInfo?id=" + id
        )
            .then((resp) => {
                return resp.json();
            })
            .catch(() => {
                console.log("error");
            })
            .then((data) => {
                console.log(data);
                setPictureData(data);
                setLoading(false);
            })
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

    return (
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
                    <Form.Control type="text" value={pictureData.fileType} disabled  />
                </Form.Group>
                <Form.Group controlId="createDate">
                    <Form.Label>Erstelldatum:</Form.Label>
                    <Form.Control type="text" value={pictureData.createDate} disabled />
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