import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from './component/scrollToTop';
import { Navbar } from './component/navbar';
import { Footer } from './component/footer';

import { Landing } from './views/landing';
import { Home } from './views/home';
import { Login } from './views/login';
import { Register } from './views/register';
import { ConfirmEmail } from './views/confirmEmail';
import { ForgotPassword } from './views/forgotPassword';
import { ResetPassword } from './views/resetPassword';
import { WebDirectory } from './views/webDirectory';

import injectContext from './store/appContext';

const Layout = () => {
	//the basename is used when your project is published in a subdirectory and not in the root of the domain
	// you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
	const basename = process.env.BASENAME || "";

	return (
		<div className="d-flex flex-column">
			<BrowserRouter basename={basename}>
				<ScrollToTop>
					<Navbar />
					<Switch>
						<Route exact path="/">
							<Landing />
						</Route>
						<Route exact path="/Login">
							<Login />
						</Route>
						<Route exact path="/Register">
							<Register />
						</Route>
						<Route exact path="/ForgotPassword">
							<ForgotPassword />
						</Route>
						<Route exact path="/Home">
							<Home />
						</Route>
						<Route exact path="/ConfirmEmail/:EVToken">
							<ConfirmEmail />
						</Route>
						<Route exact path="/ResetPassword/:GUID">
							<ResetPassword />
						</Route>
						<Route exact path="/WebDirectory">
							<WebDirectory />
						</Route>
						<Route exact path="/WebDirectory/Index">
							<WebDirectory />
						</Route>
						<Route>
							<h1>Not found!</h1>
						</Route>
					</Switch>
					<Footer />
				</ScrollToTop>
			</BrowserRouter>
		</div>
	);
};

export default injectContext(Layout);