/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import Account from '../services/account';

export const Register = () => {
	const AccountSVC = new Account();
	const [Loading, setLoading] = useState(false);
	const [Submitted, setSubmitted] = useState(false);

	const { register, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		criteriaMode: 'all'
	});

	const { dirtyFields, errors, isDirty, isValid } = formState

	const onSubmit = data => {
		setLoading(true);
		AccountSVC.Register(data).then(res => {
			setSubmitted(res);
			setLoading(false);
		});
	}

	if (Submitted) {
		return (
			<div className="card-success">
				<div className="upper-side bg-primary">
					<i className="fa fa-check" />
					<h3 className="status"> Registro Existoso </h3>
				</div>
				<div className="lower-side">
					<p className="card-message">Su cuenta ha sido creada exitosamente</p>
					<Link to="/Login" className="card-btn-success text-decoration-none bg-primary">
						Continuar
						</Link>
				</div>
			</div>
		);
	} else {

		return (
			<section className="container mw-90 my-5">
				<div className="card-contact mw-100 mx-auto p-3">
					<div className="upper-side bg-dark mb-2">
						<h2 className="mb-0 text-font-base text-center">Registro</h2>
					</div>
					<div className="text-center">
						<p className="text-font-base">Crea tu cuenta y forma parte de nuestra familia</p>
					</div>
					<article className="card-body mx-auto py-0">
						<form onSubmit={handleSubmit(onSubmit)} >
							{/* onChange={() => ValidateForm()}> */}
							<div className="form-group input-group m-0">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-user"></i></span>
								</div>
								<input type="text" className="form-control" placeholder="Nombre Completo" maxLength="30" pattern="^[a-zA-Z\s]+$"
									{...register('FullName', {
										required: true
										, minLength: { value: 2, message: 'Debe ser de al menos 2 caractéres!' }
										, pattern: { value: /^[a-zA-Z\s]+$/, message: 'Debe contener solo letras!' }
									})} />
							</div>
							<div className="form-group mb-1">
								<label className={errors.FullName?.type === 'required' ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.FullName?.type === 'required' ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Campo requerido!
                   			</label>
								{errors.FullName?.type === 'minLength' &&
									(<label className="col label-alert text-font-base text-danger">
										<i className="fa fa-times-circle"></i> {errors.FullName?.message}
									</label>)
								}
								{errors.FullName?.type === 'pattern' &&
									(<label className="col label-alert text-font-base text-danger">
										<i className="fa fa-times-circle"></i> {errors.FullName?.message}
									</label>)
								}
							</div>
							<div className="form-group input-group m-0">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-envelope"></i></span>
								</div>
								<input type="email" className="form-control" placeholder="Correo Electrónico" maxLength="30"
									{...register('Email', {
										required: true
										, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Cuenta de correo Invalida!' }
										, validate: {
											ExistingEmail: (value) => {
												return AccountSVC.CheckEmailAvailability(value).then(res => {
													return res || "Cuenta ya se encuentra registrada!"
												});
											}
										}
									})} />
							</div>
							<div className="form-group mb-1">
								<label className={errors.Email?.type === 'required' ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Email?.type === 'required' ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Campo requerido!
                   			</label>
								{errors.Email?.type === 'pattern' &&
									(<label className="col label-alert text-font-base text-danger">
										<i className="fa fa-times-circle"></i> {errors.Email?.message}
									</label>)
								}
								{errors.Email?.type === 'ExistingEmail' &&
									(<label className="col label-alert text-font-base text-danger">
										<i className="fa fa-times-circle"></i> {errors.Email?.message}
									</label>)
								}
							</div>

							<div className="form-group input-group m-0">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-lock"></i></span>
								</div>
								<input type="Password" className="form-control" placeholder="Contraseña"
									{...register('Password', {
										required: true
										, minLength: 8
										, maxLength: 15
										, validate: {
											HasLowerCase: (value) => value && /[a-z]/.test(value)
											, HasUpperCase: (value) => value && /[A-Z]/.test(value)
											, HasNumbers: (value) => value && /[0-9]/.test(value)
										}
									})}
								/>
							</div>
							<div className="form-group mb-1">
								<label className={errors.Password?.types?.required && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.required && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Campo requerido!
                   			</label>
								<label className={errors.Password?.types?.minLength && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.minLength && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener mínimo 8 caractéres!
                   			</label>
								<label className={errors.Password?.types?.maxLength && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.maxLength && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener máximo 15 caractéres!
                   			</label>
								<label className={errors.Password?.types?.HasLowerCase && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.HasLowerCase && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 minúscula!
                   			</label>
								<label className={errors.Password?.types?.HasUpperCase && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.HasUpperCase && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 MAYUSCULA!
                   			</label>
								<label className={errors.Password?.types?.HasNumbers && dirtyFields.Password ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.Password?.types?.HasNumbers && dirtyFields.Password ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Debe tener al menos 1 número!
                   			</label>
							</div>
							<div className="form-group input-group m-0">
								<div className="input-group-prepend">
									<span className="input-group-text"><i className="fas fa-lock"></i></span>
								</div>
								<input type="Password" id="ConfirmPwd" className="form-control" placeholder="Repetir Contraseña"
									{...register('ConfirmPwd', {
										required: true
										, validate: {
											matchesPreviousPassword: (value) => {
												const { Password } = getValues();
												return Password === value || "Deben coincidir las contraseñas!";
											}
										}
									})} />
							</div>
							<div className="form-group mb-1">
								<label className={errors.ConfirmPwd?.type === 'matchesPreviousPassword' ? 'col label-alert text-font-base text-danger' : 'col label-alert text-font-base text-success'}>
									<i className={errors.ConfirmPwd?.type === 'matchesPreviousPassword' ? 'fa fa-times-circle' : 'fa fa-check-circle'}></i> Deben coincidir las contraseñas!
                   			</label>
							</div>
							<div className="form-group text-center">
								<button className="btn btn-outline-primary text-font-base btn-block" disabled={!isDirty || !isValid}>
									{Loading ? (
										<div className="spinner-border spinner-border-sm align-middle" role="status">
											<span className="sr-only">Loading...</span>
										</div>) : ''
									}
								Crear Cuenta
                     		</button >
							</div >
							<div className="form-group text-center">
								<p className="m-0">
									Tienes una cuenta? <Link to="/Login" className="text-center">Ingresar</Link>
								</p>
							</div>
						</form>
					</article>
				</div>
			</section>
		)
	}
};
