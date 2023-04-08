﻿import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getEnvVariable } from '../helper';
import { Link } from 'react-router-dom';

export function PictureOverview() {
    const [tableData, setTableData] = useState();
    const [imageFolderPath, setImageFolderPath] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var apiLink = "";
        setLoading(true);
        getEnvVariable("REACT_APP_IMAGEFOLDERPATH").
            then((data) => {
                setImageFolderPath(data + '/');

                getEnvVariable("REACT_APP_API")
                    .then((data) => {
                        fetch(
                            data + "getPictures"
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
                                setTableData(dataa);

                                setLoading(false);
                            });
                    });
            });
    }, []);

    const renderRows = (() => {
        let rows = [];

        console.log(tableData);
        console.log(imageFolderPath);

        Array.from(tableData).map((element) => {
            rows.push(
                <tr>
                    <td>{element.id}</td>
                    <td>{element.fileName}</td>
                    <td>{element.fileSize}</td>
                    <td>{element.fileType}</td>
                    <td>{element.createDate}</td>
                    <td><img className="img-fluid"
                        src={`${imageFolderPath}${element.id}\\thumbnail.jpg`}
                        alt="logo" /></td>
                    <td><Link to={`/editPicture/${element.id}`} >
                        <button>Bearbeiten</button>
                    </Link>
                        <Link to={`/deletePicture/${element.id}`}>
                            <button>Löschen</button>
                        </Link></td>
                </tr>
            )
        });

        return rows;
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>File Name</th>
                    <th>File Size</th>
                    <th>File Type</th>
                    <th>Create Date</th>
                    <th>Thumbnail</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData == null ? <div></div> : renderRows()}
            </tbody>
        </Table>
    );
}