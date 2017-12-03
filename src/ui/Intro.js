import React, { PureComponent } from 'react';
import { times } from 'lodash';

const style = {
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		zIndex: 10000,
		fontFamily: '"Fredoka One", cursive',
		color: '#79bd9a',
		fontSize: 64,
		padding: 24,
		backgroundColor: 'rgba(85, 98, 111, 0.6)'
	},

	key: {
		display: 'inline-block',
		width: 40,
		textAlign: 'center',
		backgroundColor: '#e0e4cc',
		border: '2px solid #c8c8a9',
		borderRadius: 4,
		color: '#556270',
	},

	header: {
		fontSize: 48,
		textAlign: 'center',
		textShadow: '-2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 2px 2px 0 #FFF',
		marginBottom: 10,
	},
	
	controls: {
		fontSize: 32,
		textAlign: 'center',
		marginBottom: 10,
		marginTop: 40,
		textShadow: '-2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 2px 2px 0 #FFF' 
	},

	p: {
		color: '#cff09e',
		fontFamily: '"Concert One", cursive',
		fontSize: 24,
		textAlign: 'center',
		maxWidth: 500,
		lineHeight: '34px',
		margin: '0 auto',
	}
};

export default class extends PureComponent {
	render() {
		return (
			<div style={style.container} onClick={this.props.onClick}>
				<h1 style={style.header}>Snake Charmer</h1>

				<p style={style.p}>
					Snake your way through this ever-changing dungeon. Fill up your stomach before heading over to the next dungeon. Your next dungeon will magically take the shape of your snake!
				</p>

				<h2 style={style.controls}>controls</h2>
				<p style={style.p}>
					Control using the <span style={style.key}>W</span> <span style={style.key}>A</span> <span style={style.key}>S</span> <span style={style.key}>D</span> keys or by swiping left, right, up or down.
				</p>
			</div>
		);
	}
}