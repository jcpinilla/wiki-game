import React, { Component } from "react";
import $ from "jquery";

import AccountsUIWrapper from "./AccountsUIWrapper.js";

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.handleHomeClick = this.handleHomeClick.bind(this);
	}

	handleHomeClick() {
		this.props.goToGame(null);
		// $("myModal")
		// 	.modal();
	}

	render() {
		return (
			<div className="header-rc row">
				<div className="col">
					<button
						className="btn"
						type="button"
						onClick={this.handleHomeClick}>
						<i className="fa fa-home fa-2x"></i>
					</button>
				</div>
				<div className="col text-right">
					<AccountsUIWrapper />
				</div>
			</div>
		);
	}
}
