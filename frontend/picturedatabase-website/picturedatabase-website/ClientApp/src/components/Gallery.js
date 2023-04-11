import React, { Component, useEffect, useState, useRef } from 'react';
import { Gallery } from 'react-grid-gallery'
import { getEnvVariable } from '../helper';
import $ from 'jquery';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Button from '../../node_modules/@restart/ui/esm/Button';
import { WithContext as ReactTags } from 'react-tag-input';
import { useStateWithCallbackLazy } from 'use-state-with-callback';

export function GalleryPage() {
    const [images, setImages] = useState([]);
    const [slides, setSlides] = useState([]);
    const [apiUrl, setApiUrl] = useState();
    const [loading, setLoading] = useState(true);
    const [imageFolderPath, setImageFolderPath] = useState();
    const [index, setIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setLoading(true);

        getEnvVariable("REACT_APP_IMAGEFOLDERPATH").
            then((folderPath) => {
                setImageFolderPath(folderPath + '/');

                getEnvVariable("REACT_APP_API")
                    .then((data) => {
                        setApiUrl(data);

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
                                createImageData(dataa, folderPath);
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

    const getHeightAndWidthFromDataUrl = dataURL => new Promise(resolve => {
        const img = new Image()
        img.onload = () => {
            resolve({
                height: img.height,
                width: img.width
            })
        }
        img.src = dataURL
    })

    const createImageData = async (data, folderPath) => {
        let imgs = [];

        console.log("create");
        for (var i = 0; i < data.length; i++) {
            var pic = data[i];
            var path = folderPath + "/" + pic.id + "/main.jpg";
            console.log(path);
            // Get dimensions
            const dimensions = await getHeightAndWidthFromDataUrl(path)
            console.log(dimensions);

            var newTags = [];
            pic.tags.map((tag) => {
                newTags.push({
                    value: tag.id,
                    title: tag.text
                });
            });

            imgs.push({
                src: path,
                width: dimensions.width,
                height: dimensions.height,
                tags: newTags
            });
        }

        setSlides(imgs.map(img => ({
            src: img.src,
            width: img.width,
            height: img.height,
        })));
        setImages(imgs);
    }

    const handleClick = (index, item) => setIndex(index);

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
        filterForTags(tags.filter((tag, index) => index !== i));

    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
        filterForTags([...tags, tag]);
    };

    const filterForTags = (currentTags) => {
        console.log('filtering...');
        console.log(JSON.stringify(currentTags.map(f => f.text)));


        fetch(
            apiUrl + "filterPicturesByTags",
            {
                method: "POST",
                body: JSON.stringify(currentTags.map(f => f.text))
            }
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
                createImageData(dataa, imageFolderPath);
            });
    }

    const [tags, setTags] = useState([
    ]);

    const KeyCodes = {
        comma: 188,
        enter: 13
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    return (
        <div>
            <div>
                <h3>Filter:</h3>
                <ReactTags
                    tags={tags}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    inputFieldPosition="inline"
                    suggestions={suggestions}
                    minQueryLength="0"
                    allowUnique="true"
                    autocomplete
                />
            </div>
            <Gallery images={images}
                onClick={handleClick}
                enableImageSelection={false}
            ></Gallery>
            <Lightbox
                slides={slides}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
            />

        </div>
    );
}

{/*https://github.com/benhowell/react-grid-gallery*/ }
{/*https://benhowell.github.io/react-grid-gallery/examples/with-yet-another-react-lightbox*/ }