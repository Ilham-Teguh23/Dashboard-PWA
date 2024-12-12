import React from 'react';

const ConvertTimestamps = ({ timestamp }) => {
    const convertTimestamp = (timestamp) => {
        const date = new Date(Number(timestamp));
        const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleString('id-ID', options);
    };

    return (
        <span>
            {convertTimestamp(timestamp)}
        </span>
    );
};

export default ConvertTimestamps