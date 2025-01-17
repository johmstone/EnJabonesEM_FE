/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Badge } from 'antd';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import { Context } from '../store/appContext';

import Configuration from '../services/configuration'


export const Navbar = () => {

	const config = new Configuration();
	const history = useHistory();

	const { store, actions } = useContext(Context);
	const [OpenDrawer, setOpenDrawer] = useState(false);

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

	const toggleDrawer = (open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		if(event.target.id === 'logout') {
			Logout();
		}
		setOpenDrawer(open);
	};

	const LoginLogout = () => {
		if (store.isLogged) {
			return (
				<a id="logout" className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
					Salir
				</a>
			)
		} else {
			return (
				<Link to="/Login" className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
					Accesar
				</Link>
			)
		}
	}

	const BtnLoginLogout = () => {
		if (store.isLogged) {
			return (
				<a className="btn btn-toggler btn-login py-2 mx-1" onClick={() => Logout()}>
					<i className="far fa-sign-out-alt fa-125x align-middle"></i> Salir
				</a>
			)
		} else {
			return (
				<Link to="/Login" className="btn btn-toggler btn-login py-2 mx-1">
					<i className="far fa-sign-in-alt fa-125x align-middle"></i> Accesar
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
							<Link to={"/Profile"} className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
								Hola <span className="font-weight-bold">{User.FullName.split(" ")[0]}</span>
							</Link>
						) : null
					}
					{store.menu.map((item, i) => {
						let url = (item.Controller === 'Home' && item.AppID === 1 ? '' : '/' + item.Controller) + (item.Action === 'Index' ? '' : "/" + item.Action)
						return (
							<Link to={url} key={i} className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
								{item.DisplayName}
							</Link>
						)
					})}
					<Link to="/ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
						Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down align-middle"></i></Badge>
					</Link>
					<LoginLogout />
				</>
			)
		} else {
			return (
				<>
					<Link to="/ShopCart" className="text-uppercase MenuLink text-font-base text-decoration-none" onClick={toggleDrawer(false)}>
						Carrito <Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down align-middle"></i></Badge>
					</Link>
					<LoginLogout />
				</>
			)
		}
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
			<Link to="/" className="navbar-brand">
				<span className="navbar-brand mb-0 h1 text-font-base">{config.AppName}</span>
			</Link>
			<Link to="/ShopCart" className="btn btn-toggler btn-cart ml-auto mx-1 py-2">
				<Badge count={store.ShopCart.length} size="small"><i className="far fa-cart-arrow-down align-middle"></i></Badge> Carrito
			</Link>
			<BtnLoginLogout />
			<div>
				<button className="btn btn-toggler mx-1 py-2" type="button" onClick={toggleDrawer(true)}>
					<i className="fas fa-bars fa-125x align-middle"></i> Menú
				</button>
				<SwipeableDrawer
					className="navbar-header"
					anchor="right"
					open={OpenDrawer}
					onClose={toggleDrawer(false)}
					onOpen={toggleDrawer(true)}>
						<MainMenu />
				</SwipeableDrawer>
			</div>
		</nav>
	);
};