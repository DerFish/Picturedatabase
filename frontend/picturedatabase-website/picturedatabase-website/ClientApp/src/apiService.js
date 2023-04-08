import { getEnvVariable } from './helper';

export const generateGreyscale = async (id) => {
    getEnvVariable("REACT_APP_API").
        then((apiUrl) => {
            fetch(
                apiUrl + 'createGreyscale',
                {
                    method: 'POST',
                    body: JSON.stringify({ id: id })
                }
            ).then((resp) => {
                return resp;
            })
        });
}

export const generateThumbnail = async (id) => {
    getEnvVariable("REACT_APP_API").
        then((apiUrl) => {
            fetch(
                apiUrl + 'createThumbnail',
                {
                    method: 'POST',
                    body: JSON.stringify({ id: id })
                }
            ).then((resp) => {
                return resp;
            })
        });
}