import React from "react";
import PropType from "prop-types";

export const Presentations = props => (
    <div className="row m-0">
        <div className="col-sm-6">
            {
                props.PrimaryProduct.PhotoURL ?
                    (<img src={props.PrimaryProduct.PhotoURL} alt={props.PrimaryProduct.Name} className="w-100" />) : null
            }
            <p className="m-0 text-font-base my-2">
                {props.PrimaryProduct.Description}
            </p>
        </div>
        <div className="col-sm-6">

        </div>
    </div>
);

Error.propTypes = {
    PrimaryProduct: PropType.object
    // 2) add here the new properties into the proptypes object
};