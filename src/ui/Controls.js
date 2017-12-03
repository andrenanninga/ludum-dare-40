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
	},

	key: {
		position: 'absolute',
		display: 'block',
		fontSize: 28,
		width: 48,
		height: 42,
		margin: 2,
		paddingTop: 10,
		textAlign: 'center',
		backgroundColor: '#e0e4cc',
		border: '2px solid #c8c8a9',
		borderRadius: 4,
	},

	w: {
		top: '70%',
		left: 'calc(50% - 24px)'
	},

	s: {
		top: 'calc(70% + 60px)',
		left: 'calc(50% - 24px)'
	},

	d: {
		top: 'calc(70% + 60px)',
		left: 'calc(50% - 24px + 56px)'
	},

	a: {
		top: 'calc(70% + 60px)',
		left: 'calc(50% - 24px - 56px)'
	}
};

export default class extends PureComponent {
	render() {
		return (
			<div style={style.container} onClick={this.props.onRestart}>
				<span style={{ ...style.key, ...style.w }}>W</span>
				<span style={{ ...style.key, ...style.s }}>S</span>
				<span style={{ ...style.key, ...style.d }}>D</span>
				<span style={{ ...style.key, ...style.a }}>A</span>
			</div>
		);
	}
}