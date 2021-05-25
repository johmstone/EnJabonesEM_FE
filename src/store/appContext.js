import React, { useState, useEffect } from "react";
import getState from "./flux.js";
import { isExpired } from 'react-jwt';

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		//this will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
			const user = JSON.parse(localStorage.getItem('User'));
			
			let model = {
			  	AppID: 1,
			  	UserID: 0
			}
			
			if(user) {
				if(!isExpired(user.Token))  {
					//console.log('Login')
					state.actions.Login();
					model.AppID = 2;
					model.UserID = user.UserID;
					state.actions.uploadMenu(model);
					state.actions.UploadRoleList();
				} else {
					localStorage.removeItem('User');
					state.actions.Logout();
					state.actions.uploadMenu(model);
				}
			} else {
				state.actions.Logout();
				state.actions.uploadMenu(model);
			}
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
