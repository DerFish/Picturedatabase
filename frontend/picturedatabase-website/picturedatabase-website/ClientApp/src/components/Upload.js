import React, { useState } from 'react';
import { getEnvVariable } from '../helper';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function Upload() {
    const displayName = Upload.name;
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const sendReq = async () => {
        console.log(process.env.REACT_APP_API + 'uploadPicture');

        const formData = new FormData();

        formData.append('File', selectedFile);

        getEnvVariable("REACT_APP_API")
            .then((data) => {
                fetch(
                    data + 'uploadPicture',
                    {
                        method: 'PUT',
                        body: formData,
                    }
                )
                    .then((req) => {
                        return req.json();
                    }).
                    then((data) => {
                        navigate("/editPicture/" + data);
                    })
            });
    }

    const handleSubmission = async () => {
        sendReq().then((data) => {
        });
    };

    return (
        <div>
            <Form.Control type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
                <div>
                    <p>Dateiname: {selectedFile.name}</p>
                    <p>Dateityp: {selectedFile.type}</p>
                    <p>Größe in Bytes: {selectedFile.size}</p>
                </div>
            ) : (
                <p>Datei auswählen um Daten anzuzeigen</p>
            )}
            <div>
                <Button onClick={handleSubmission}>Hochladen</Button>
            </div>
        </div>
    );
}