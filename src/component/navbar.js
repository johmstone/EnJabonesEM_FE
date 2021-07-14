/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Badge } from 'antd';

import { Context } from '../store/appContext';

import Configuration from '../services/configuration'

export const Navbar = () => {

	const config = new Configuration();
	const history = useHistory();

	const { store, actions } = useContext(Context);

	const User = JSON.parse(localStorage.getItem('User'));

	const Logout = () => {
		localStorage.removeItem('User');
		localStorage.clear();
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
				<a className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={() => Logout()}>
					Salir
				</a>
			)
		} else {
			return (
				<Link to="/Login" className="text-uppercase MenuLink text-font-base text-decoration-none">
					Accesar
				</Link>
			)
		}
	}

	function MainMenu() {
		const isMenu = store.menu ? true : false;
		if (isMenu) {
			return (
				<>
					{
						store.isLogged ? (
							<Link to={"/Profile"} className="text-uppercase MenuLink text-font-base text-decoration-none">
								Hola <span className="font-weight-bold">{User.FullName.split(" ")[0]}</span>
							</Link>
						) : null
					}
					{store.menu.map((item, i) => {
						let url = (item.Controller === 'Home' && item.AppID === 1 ? '' : '/' + item.Controller) + (item.Action === 'Index' ? '' : "/" + item.Action)
						return (
							<Link to={url} className="text-uppercase MenuLink text-font-base text-decoration-none">
								{item.DisplayName}
							</Link>
						)
					})}
					<Link to="/ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none">
						Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down"></i></Badge>
					</Link>
					<LoginLogout />
				</>
			)
		} else {
			return (
				<>
					<Link to="/ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none">
						Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down"></i></Badge>
					</Link>
					<LoginLogout />
				</>
			)
		}
	}


	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
			<Link to="/" className="navbar-brand">
				<span className="navbar-brand mb-0 h1">{config.AppName}</span>
			</Link>
			<Link to="/ShopCart" className="btn-cart ml-auto mr-2">
				<Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down p-1"></i></Badge>
			</Link>
			<div className="dropdown bg-dark">
				<button className="navbar-toggler" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<MainMenu />
				</div>
			</div>
		</nav>
	);
};