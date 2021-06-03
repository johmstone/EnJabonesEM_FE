import WebDirectoryService from '../services/webdirectory';
import RolesService from '../services/roles';
import UsersService from '../services/users';
import ProductServices from '../services/products';

const getState = ({ getStore, getActions, setStore }) => {
	
	const WebDirectorySVC = new WebDirectoryService();
	const RolesSVC = new RolesService();
	const UsersSVC = new UsersService();
	const ProductSVC = new ProductServices();

	return {
		store: {
			isLoading: true
			,isLogged: false
			,menu: []
			,ShopCart: []
			,WDList:[]
			,RoleList: []
			,UsersList: []
			,ProductList: []
		},
		actions: {
			uploadMenu: (model) => {								
				WebDirectorySVC.Menu(model).then(items => {
					//console.log(items);
					setStore({ menu: items});
					setStore({ isLoading: false })
				});
			},
			uploadWDList: () => {			
				setStore({ isLoading: true })				
				WebDirectorySVC.List().then(items => {
					//console.log(items);
					setStore({ WDList: items});
					setStore({ isLoading: false })
				});
			},
			UploadRoleList: () => {
				setStore({ isLoading: true })				
				RolesSVC.List().then(items => {
					//console.log(items);
					setStore({ RoleList: items});
					setStore({ isLoading: false })
				});
			},
			UploadUsersList: () => {
				setStore({ isLoading: true })				
				UsersSVC.List().then(items => {
					//console.log(items);
					setStore({ UsersList: items});
					setStore({ isLoading: false })
				});
			},
			UploadProductList: () => {
				setStore({ isLoading: true })				
				ProductSVC.PrimaryProductList().then(items => {
					setStore({ ProductList: items});
					setStore({ isLoading: false })
				});
			},
			Login: () => {
				setStore({ isLogged: true});
			},
			Logout: () => {
				setStore({ isLogged: false });				
			},
			Loading: (value) => {
				setStore({ isLoading: value })
			}
		}
	};
};

export default getState;
