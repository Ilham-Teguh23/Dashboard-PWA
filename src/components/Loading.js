import React from "react";
import "../styles/loading.css"

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-text">
                Loading
                <div className="dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        </div>
    )
}

export default Loading