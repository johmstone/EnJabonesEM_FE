import WebDirectory from '../services/webdirectory';

const getState = ({ getStore, getActions, setStore }) => {
	
	const WebDirectorySVC = new WebDirectory();

	return {
		store: {
			menu: []
			,isLogged: false
		},
		actions: {
			uploadMenu: (model) => {								
				WebDirectorySVC.Menu(model).then(items => {
					console.log(items);
					setStore({ menu: items});
				});
			},
			Login: () => {
				setStore({ isLogged: true})
			},
			Logout: () => {
				setStore({ isLogged: false })
			}
		}
	};
};

export default getState;
