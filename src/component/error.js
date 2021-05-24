import React from "react";
import PropType from "prop-types";

export const Error = props => (
    <div className="container mw-80 my-5">
        <div className="col p-0 text-center text-font-base">
            <h2 className="mb-0">
                <i className="fas fa-exclamation-triangle text-danger mr-3"></i>
                            Error
                <i className="fas fa-exclamation-triangle text-danger ml-3"></i>
            </h2>
        </div>
        <p className="text-center m-0 text-font-base my-2">{ props.Message }</p>
    </div>
);

Error.propTypes = {
    Message: PropType.string
    // 2) add here the new properties into the proptypes object
};