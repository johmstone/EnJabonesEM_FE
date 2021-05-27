/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Badge } from 'antd';

import { Context } from '../store/appContext';

import Configuration from '../services/configuration'
export const Navbar = () => {

	const { store, actions } = useContext(Context);
	let history = useHistory();
	let User = JSON.parse(localStorage.getItem('User'));
	const config = new Configuration();
	const Logout = () => {
		localStorage.removeItem('User');
		actions.Logout();
		let model = {
			AppID: 1,
			UserID: 0
		}
		actions.uploadMenu(model);
		history.push("/");
	}

	const LoginLogout = () => {
		if (store.isLogged) {
			return (
				<li className="nav-item MenuLink">
					<a className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={() => Logout()}>
						Salir
					</a>
				</li>
			)
		} else {
			return (
				<li className="nav-item MenuLink">
					<Link to="Login" className="text-uppercase MenuLink text-font-base text-decoration-none">
						Accesar
					</Link>
				</li>
			)
		}
	}

	function MainMenu() {
		const isMenu = store.menu ? true : false;
		if (isMenu) {
			return (
				<ul className="navbar-nav">
					{
						store.isLogged ? (
							<li className="nav-item MenuLink">
								<Link to={"/Profile"} className="text-uppercase MenuLink text-font-base text-decoration-none">
									Hola <span className="font-weight-bold">{ User.FullName.split(" ")[0]}</span>
								</Link>
							</li>
						) : null
					}
					{store.menu.map((item, i) => {
						let url = (item.Controller === 'Home' && item.AppID === 1 ? '' : '/' + item.Controller) + (item.Action === 'Index' ? '' : "/" + item.Action)
						return (
							<li className="nav-item MenuLink" key={i}>
								<Link to={url} className="text-uppercase MenuLink text-font-base text-decoration-none">
									{item.DisplayName}
								</Link>
							</li>

						)
					})}
					<LoginLogout />
					<li className="nav-item MenuLink menuLink-cart">
						<Link to="/ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none">
							Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down"></i></Badge>
						</Link>
					</li>
				</ul>
			)
		} else {
			return (
				<ul className="navbar-nav">
					<LoginLogout />
					<li className="nav-item MenuLink menuLink-cart">
						<Link to="./ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none">
							Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down"></i></Badge>
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
			<Link to="/ShopCart" className="btn-cart ml-auto mr-2">
				<Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down p-1"></i></Badge>
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