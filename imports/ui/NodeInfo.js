import React, { Component } from "react";

import formatDuration from "../api/durationFormater.js";

export default class NodeInfo extends Component {
	render() {
		let node = this.props.node;
		let startTime = this.props.startTime;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;

		let page = node.page;
		let discoveredBy = node.discoveredBy;
		let discoveredAt = node.discoveredAt;
		let otherVisits = node.otherVisits;
		if (otherVisits) {
			otherVisits.sort((visit1, visit2) => 
				visit1.visitedAt.getTime()-visit2.visitedAt.getTime());
		}
		return (
			<div>
				<h1>{page}</h1>
				{page !== startPage &&
					<div>
						<h2>Discovered by <em>{discoveredBy}</em> after {formatDuration(startTime, discoveredAt)}</h2>
						{otherVisits.length !== 0 &&
							<div>
								<h3>Also visited by</h3>
								{
									otherVisits.map(visit =>
										<p key={visit.visitedBy}>
											<em>{visit.visitedBy}</em> after {formatDuration(startTime, visit.visitedAt)}
										</p>
									)
								}
							</div>
						}
					</div>
				}
				{(page === startPage || page == endPage) &&
					<h2>{page === startPage ? "Start" : "End"} page!</h2>
				}
			</div>
		);
	}
}
