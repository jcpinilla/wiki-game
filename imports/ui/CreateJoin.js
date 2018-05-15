import React, { Component } from "react";

import Create from "./Create.js";
import Join from "./Join.js";

export default class CreateJoin extends Component {
	render() {
		return (
			<div>
				<Create goToGame={this.props.goToGame} />
				<Join goToGame={this.props.goToGame} />
			</div>
		);
	}
}
