/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from '../store/appContext';

import Configuration from '../services/configuration'
export const Navbar = () => {

	const { store } = useContext(Context);

	const config = new Configuration();

	function MainMenu() {
		const isMenu = store.menu ? true : false;
		if (isMenu) {
			return (
				<ul className="navbar-nav">
					{store.menu.map((item, i) => {
						let url = (item.Controller === 'Home' ? '' : item.Controller) + (item.Action === 'Index' ? '' : "/" + item.Action)
						return (
							<li className="nav-item MenuLink" key={i}>
								<Link to={url} className="text-uppercase MenuLink text-font-base text-decoration-none">
									{item.DisplayName}
								</Link>
							</li>

						)
					})}
					<li className="nav-item MenuLink">
						<Link to="Login" className="text-uppercase MenuLink text-font-base text-decoration-none">
							Accesar
						</Link>
					</li>
				</ul>
			)
		} else {
			return (
				<ul className="navbar-nav">
					<li className="nav-item MenuLink">
						<Link to="Login" className="text-uppercase MenuLink text-font-base text-decoration-none">
							Accesar
						</Link>
					</li>
				</ul>
			)
		}
	}
	

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<Link to="/" className="navbar-brand">
				<span className="navbar-brand mb-0 h1">{config.AppName}</span>
			</Link>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#NavMenu" aria-controls="NavMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse bg-dark" id="NavMenu">
				<MainMenu />
			</div>
		</nav>
	);
};