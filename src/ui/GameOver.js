import React, { PureComponent } from 'react';
import { times } from 'lodash';

const style = {
	container: {
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		zIndex: 10000,
		fontFamily: '"Fredoka One", cursive',
		color: '#79bd9a',
		fontSize: 64,
		backgroundColor: 'rgba(85, 98, 111, 0.6)'
	},

	small: {
		display: 'block',
		fontSize: 24,
		margin: 20
	}
};

export default class extends PureComponent {
	render() {
		return (
			<div style={style.container} onClick={this.props.onRestart}>
				<span>game over!</span>
				<small style={style.small}>click to restart</small>
			</div>
		);
	}
}