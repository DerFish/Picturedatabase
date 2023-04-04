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

    const testApi = async () => {
        const response = await fetch('picture/uploadfile');
        const data = response.text;
        console.log(await response.text());
    };

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append('File', selectedFile);

        fetch(
            'https://localhost:32770/uploadpicture',
            {
                method: 'PUT',
                body: formData,

            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
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
                <button onClick={testApi}>Test</button>
            </div>
        </div>
    );
}