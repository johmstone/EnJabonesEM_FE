/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";

import { Context } from '../store/appContext';

import AuthenticationService from '../services/authentication';
import WebDirectoryService from '../services/webdirectory';

import { Loading } from '../component/loading';
import { Error } from '../component/error';

export const Formula = () => {

	const AuthSVC = new AuthenticationService();
	const WebDirectorySVC = new WebDirectoryService();
	const location = useLocation();

	const [isLogin] = useState(AuthSVC.isAuthenticated());
	const { store } = useContext(Context);
	const [isLoading, setLoading] = useState(false);
	const [Rights, setRights] = useState({});

	useEffect(() => {
		if (isLogin) {
			LoadPage();
			setLoading(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const LoadPage = () => {
		const pathname = location.pathname.slice(1).split('/');
		let model = {
			Controller: pathname[0],
			Action: pathname[1] === undefined ? "Index" : pathname[1]
		}
		WebDirectorySVC.RightsValidation(model).then(res => {
			//console.log(res);
			setRights(res);
			return res;
		}).then(src => {
			console.log(src);
			setLoading(false);
		});

	}

	const ContentPage = () => {
		return (
			<section className="container">
				<div className="text-center">
					<h1>Formula Page</h1>

				</div>
			</section>
		)
	}

	if (store.isLoading || isLoading) {
		return <Loading />
	} else {
		if (isLogin) {
			if (Rights.ReadRight) {
				return <ContentPage />
			} else {
				return <Error Message='Usted no esta autorizado para ingresar a esta seccion, si necesita acceso contacte con un administrador.' />
			}
		} else {
			return <Redirect to={{ pathname: "/Login" }} />;
		}
	}
};
