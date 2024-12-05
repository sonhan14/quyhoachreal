import React from 'react';

const EmptyMessage = ({ message }) => {
    return (
        <div className="flex justify-center items-center user-select-none px-2">
            <span className="text-white empty-message-shadow text-center">{message}</span>
        </div>
    );
};

export default EmptyMessage;
