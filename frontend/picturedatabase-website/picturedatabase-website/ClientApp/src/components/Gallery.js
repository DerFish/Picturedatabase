import React, { Component } from 'react';

export function Gallery() {
    const renderForecastsTable = (forecasts) => {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <h1 id="tabelLabel">Gallerie</h1>
            <p>This component demonstrates fetching data from the server.</p>
            https://github.com/benhowell/react-grid-gallery
            https://benhowell.github.io/react-grid-gallery/examples/with-yet-another-react-lightbox
        </div>
    );
}