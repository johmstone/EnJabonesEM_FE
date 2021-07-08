/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import { Context } from '../store/appContext';
import { message } from 'antd';

import Authentication from '../services/authentication';
import Account from '../services/account';

export const Login = () => {

	const AuthSVC = new Authentication();
	const AccountSVC = new Account();

	const { actions } = useContext(Context);
	const [isLogin, setLogin] = useState(AuthSVC.isAuthenticated());
	const [Loading, setLoading] = useState(false);
	const [NeedSomething, setNeedSomething] = useState({ Action: '', msg: '' });
	const [User, setUser] = useState({});

	const { register, handleSubmit, formState, reset } = useForm({
		mode: 'onChange',
		criteriaMode: 'all'
	});

	const { isDirty, isValid } = formState

	const onSubmit = data => {
		setLoading(true);
		AuthSVC.GetIP().then(res => {
			let model = {
				Email: data.Email,
				Password: data.Password,
				IP: res.ip
			}
			AuthSVC.Login(model).then(auth => {
				setLoading(false);
				if (auth.status) {
					message.error({
						content: auth.message,
						style: {
							marginTop: "15vh"
						}
					});
				} else {
					if (auth.Token) {
						localStorage.setItem('User', JSON.stringify(auth));
						actions.Login();
						setLogin(true);
						let model = {
							AppID: 2,
							UserID: auth.UserID
						}
						actions.uploadMenu(model);
					} else {
						setUser(auth);
						if (!auth.EmailValidated) {
							setNeedSomething({ Action: 'ValidateEmail', msg: 'Necesita validar su correo electrónico' })
						} else {
							localStorage.setItem('TempUser',JSON.stringify(auth))
							setNeedSomething({ Action: 'ResetPassword', msg: 'Necesita restaurar su contraseña' })
						}
					}
				}
			});
		});
	}

	const GenerateEmailValidation = () => {
		console.log(User.Email);
		AccountSVC.ConfirmEmailRequest(User.Email).then(res => {
			if (res) {
				ResetLogin();
			}
		});
	}

	const ResetLogin = () => {
		setLoading(false);
		setNeedSomething({ Action: '', msg: '' });
		setUser({});
		reset();
	}

	
	if (NeedSomething.Action === 'ResetPassword') {
		return <Redirect to={{ pathname: "/ResetPassword"}} />;
	} else if (NeedSomething.Action === 'ValidateEmail') {
		return (
			<div className="card-success">
				<div className="upper-side bg-primary">
					<i className="far fa-question-circle mb-3"></i>
					<h3 className="status"> Validación Pendiente </h3>
				</div>
				<div className="lower-side">
					<p className="card-message">Su cuenta de correo aún esta pendiente de validar!</p>
					<p className="card-message">Revise su correo electrónico o solicite nuevamente su validación</p>
					<div className="form-group text-center">
						<button className="btn btn-outline-primary text-font-base btn-block my-3" onClick={() => GenerateEmailValidation()}>
							Solicitar Validación
                   		</button>
						<button className="btn btn-outline-secondary text-font-base btn-block my-3" onClick={() => ResetLogin()}>
							Ingresar
                   		</button>
					</div >
				</div>

			</div>
		)
	} else if (isLogin) {
		return <Redirect to={{ pathname: "/Home" }} />;
	} else {
		return (
			<section className="container mw-90 my-5">
				<div className="card-contact mw-100 mx-auto p-3">
					<div className="upper-side bg-dark mb-2">
						<h2 className="mb-0 text-font-base text-center text-white">Acceso</h2>
					</div>
					<div className="text-center">
						<p className="text-font-base"></p>
					</div>
					<article className="card-body mx-auto py-0">
						<form onSubmit={handleSubmit(onSubmit)} >
							<div className="form-group input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-envelope"></i></span>
								</div>
								<input type="email" className="form-control" placeholder="Correo Electrónico" maxLength="30"
									{...register('Email', { required: true })} />
							</div>
							<div className="form-group input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-lock"></i></span>
								</div>
								<input type="Password" className="form-control" placeholder="Contraseña"
									{...register('Password', { required: true })}
								/>
							</div>

							<div className="form-group text-center">
								<button className="btn btn-outline-primary text-font-base btn-block" disabled={!isDirty || !isValid}>
									{Loading ? (
										<div className="spinner-border spinner-border-sm align-middle" role="status">
											<span className="sr-only">Loading...</span>
										</div>) : ''
									}
								Ingresar
                     			</button >
							</div >
							<div className="form-group text-center">
								<Link to="/Register" className="text-center">Registrarse como nuevo Usuario</Link>
								<br />
								<Link to="/ForgotPassword" className="text-center">Olvido su contraseña?</Link>
							</div>
						</form>
					</article>
				</div>
			</section>
		)
	}
};
