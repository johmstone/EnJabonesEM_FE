import React from "react";

import Configuration from '../services/configuration'

export const Footer = () =>{ 
	const config = new Configuration();

	return (
	<footer className="footer mt-auto py-3 text-center bg-dark">
		<p className="text-white m-0">
			Made by<i className="far fa-copyright text-danger mx-2 align-middle"></i>
			<a href={config.CreatedInStoneLink} target="_blank" rel="noreferrer" className="text-secondary font-weight-bold">CreatedIn<span className="text-white">Stone</span></a>
		</p>
	</footer>
);
}