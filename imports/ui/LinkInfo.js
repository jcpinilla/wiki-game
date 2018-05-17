import React, { Component } from "react";

import formatDuration from "../api/durationFormater.js";

export default class LinkInfo extends Component {
	render() {
		let startTime = this.props.startTime;
		let link = this.props.link;
		let source = link.source;
		let target = link.target;
		let createdBy = link.createdBy;
		let createdAt = link.createdAt;
		let otherTravels = link.otherTravels;
		if (otherTravels) {
			otherTravels.sort((travel1, travel2) => 
				travel1.traveledAt.getTime()-travel2.traveledAt.getTime());
		}
		return (
			<div>
				<h1>Link from {source} to {target}</h1>
				<h2>Created by {createdBy} after {formatDuration(startTime, createdAt)}</h2>
				{otherTravels && otherTravels.length !== 0 &&
					<div>
						<h3>Others that used the same link:</h3>
						{
							otherTravels.map(travel => 
								<p>{travel.traveledBy} after {formatDuration(startTime, travel.traveledAt)}</p>
							)
						}
					</div>
				}
			</div>
		);
	}
}
