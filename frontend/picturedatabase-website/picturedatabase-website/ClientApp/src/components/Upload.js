import React, { useState } from 'react';

export function Upload() {
    const displayName = Upload.name;

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const sendReq = async () => {
        const formData = new FormData();

        formData.append('File', selectedFile);

        const response = await fetch(
            'https://localhost:32774/uploadPicture',
            {
                method: 'PUT',
                body: formData,
            }
        );

        return response.json();
    }

    const handleSubmission = async () => {
        sendReq().then((data) => {
            console.log(data);
        });


    };

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                    <p>
                        lastModifiedDate:{' '}
                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    );
}