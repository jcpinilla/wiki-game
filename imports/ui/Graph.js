import React, { Component } from "react";
import * as d3 from "d3";

export default class Graph extends Component {
	constructor(props) {
		super(props);
		this.tick = this.tick.bind(this);
		this.drawNode = this.drawNode.bind(this);
		this.drawLink = this.drawLink.bind(this);
		this.dragStarted = this.dragStarted.bind(this);
		this.dragged = this.dragged.bind(this);
		this.dragEnded = this.dragEnded.bind(this);

		this.handleMouseOverCircle = this.handleMouseOverCircle.bind(this);
		this.handleMouseOutCircle = this.handleMouseOutCircle.bind(this);
		this.handleMouseOverLine = this.handleMouseOverLine.bind(this);
		this.handleMouseOutLine = this.handleMouseOutLine.bind(this);
	}

	componentDidMount() {
		this.svg = d3.select("#graph")
			.attr("width", 500)
			.attr("height", 200);

		this.width = +this.svg.attr("width");
		this.height = +this.svg.attr("height");

		this.dashArray = "6,1";
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
		this.circleGrowthFactor = 1.5;
		this.lineGrowthFactor = 2;
		
		this.baseRadius = 9;
		this.biggerRadius = this.baseRadius * 2;
		this.baseLineStrokeWidth = 8;

		this.color = d3.scaleOrdinal(d3.schemeCategory20);

		this.simulation = d3.forceSimulation()
			.force("center", d3.forceCenter(this.centerX, this.centerY))
			.force("collide", d3.forceCollide(this.baseRadius+10))
			.force("charge", d3.forceManyBody()
				.strength(-50))
			.force("link", d3.forceLink()
				.id(d => d.page)
				.strength(0.7));
		this.update();
	}

	update() {
		let graph = this.props.graph;
		let startNode = null;
		for (let n of graph.nodes) {
			if (n.page === this.props.startPage) {
				startNode = n;
				break;
			}
		}
		startNode.fx = this.centerX;
		startNode.fy = this.centerY;

		let svg = this.svg;
		let simulation = this.simulation;

		simulation.nodes(graph.nodes)
			.on("tick", this.tick);
		simulation.force("link")
			.links(graph.links);

		this.link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter()
			.append("line")
				.attr("stroke-width", this.baseLineStrokeWidth)
				.on("mouseover", this.handleMouseOverLine)
				.on("mouseout", this.handleMouseOutLine);

		this.node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(graph.nodes)
			.enter()
			.append("circle")
				.call(d3.drag()
					.on("start", this.dragStarted)
					.on("drag", this.dragged)
					.on("end", this.dragEnded))
				.attr("r", d => {
					if (d.page === this.props.endPage) {
						return this.biggerRadius;
					}
					return this.baseRadius;
				})
				.on("mouseover", this.handleMouseOverCircle)
				.on("mouseout", this.handleMouseOutCircle);

	}

handleMouseOverCircle(d) {
	let circle = d3.select(d3.event.target);
	let endPage = this.props.endPage;
	circle
		.transition()
		.attr("r", (d.page === endPage ? this.biggerRadius : this.baseRadius) * this.circleGrowthFactor);
	this.props.setSelectedNode(d);
}

handleMouseOutCircle(d) {
	let circle = d3.select(d3.event.target);
	let endPage = this.props.endPage;
	circle
		.transition()	
		.attr("r", d.page === endPage ? this.biggerRadius : this.baseRadius);
	this.props.setSelectedNode(null);
}

handleMouseOverLine(l) {
	let line = d3.select(d3.event.target);
	line
		.transition()
		.attr("stroke-width", this.baseLineStrokeWidth * this.lineGrowthFactor)
		.attr("stroke-dasharray", null);
	this.props.setSelectedLink({
		source: l.source.page,
		target: l.target.page,
		createdBy: l.createdBy,
		createdAt: l.createdAt,
		otherTravels: l.otherTravels
	});
}

handleMouseOutLine(l) {
	let line = d3.select(d3.event.target);
	line
		.transition()
		.attr("stroke-width", this.baseLineStrokeWidth)
		.attr("stroke-dasharray",  l => {
			return l.createdBy !== l.target.discoveredBy ? this.dashArray : null;
		});
	this.props.setSelectedLink(null);
}

	tick() {
		this.drawLink(this.link);
		this.drawNode(this.node);
	}

	drawNode(node) {
		let startPage = this.props.startPage;
		node
			.attr("stroke", "black")
			.attr("fill", d => 
				d.page !== startPage ? this.color(d.discoveredBy) : "black"
			)
			.attr("cx", d => {
				return d.x;
			})
			.attr("cy", d => {
				return d.y;
			});
	}

	drawLink(link) {
		link
			.attr("stroke", l => this.color(l.createdBy))
			// .attr("stroke-width", l => {
			// 	return l.createdBy !== l.target.discoveredBy ? 8 : 4;
			// })
			.attr("stroke-dasharray", l => {
				return l.createdBy !== l.target.discoveredBy ? this.dashArray : null;
			})
			.attr("x1", l => l.source.x)
			.attr("y1", l => l.source.y)
			.attr("x2", l => l.target.x)
			.attr("y2", l => l.target.y);
	}

	dragStarted(d) {
		let startPage = this.props.startPage;
		if (d.page === startPage) return;
		if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	dragged(d) {
		let startPage = this.props.startPage;
		if (d.page === startPage) return;
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	dragEnded(d) {
		let startPage = this.props.startPage;
		if (d.page === startPage) return;
		if (!d3.event.active) this.simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	render() {
		return <svg id="graph"></svg>;
	}
}
