
import React from 'react';
import { render } from 'react-dom';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Routes
} from 'react-router-dom';


//import List from './List';
import Login from './login.js'
import Register from './register.js'
import StandardHeader from './standard_header.js'
import Home from './Home.js'
//	<Route path = "/user/:user" exact component={User} />
// <Route path = "/user" exact render={() => (<Home data={{hmm:"what"}}/>)}  />
// export default class App extends React.Component {

// 	constructor(props) {
// 		super(props)
// 	}

// 	handleClick(e) {
// 		console.log("CLICKED");
// 	}

// 	componentDidMount() {

// 		//mixpanel.track("An event");
// 	}
// 	//#FAFAFA
// 	render() {
// 		//mixpanel.init("63586aff50e8055326d4fb5944633383");
// 		return (
// 			<div className="App" id='root' style={{ width: '100%', minWidth: '1200px' }}>
// 				<StandardHeader notifications={{}} />
// 				<link rel="stylesheet" href="/styles.css" />
// 				<Routes>
// 					<Route exact path="/" element={<Home data={this.props.data} />} />		
// 				</Routes>
// 				<script type="text/javascript" src="../public/bundle.js"> </script>
// 			</div>
// 		);
// 	}
// }
export default function App()
{
	return(<div>
 			<div className="App" id='root' style={{ width: '100%', minWidth: '1200px' }}>
 				<link rel="stylesheet" href="/styles.css" />
 				<Routes>
 					<Route exact path="/" element={<Home />} data = {this.props.data}/>		
 				</Routes>
 				<script type="text/javascript" src="../public/bundle.js"> </script>
 			</div>
		</div>
	)
}