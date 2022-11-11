import React from "react";

export default function Error({ message }) {
    return (
        <div>
            <div className="alert alert-danger" role="alert">
                {message}
            </div>
        </div>
    );
}