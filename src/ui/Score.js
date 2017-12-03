import React, { PureComponent } from 'react';

const style = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		top: 32,
		right: 48,
		fontFamily: '"Fredoka One", cursive',
		color: '#79bd9a',
	},

	text: {
		fontSize: 24,
		marginRight: 8,
	},

	score: {
		fontSize: 36,
	}
};



export default class extends PureComponent {
	render() {
		const { score } = this.props;
		return (
			<div style={style.container}>
				<span style={style.text}>score -</span> <span style={style.score}>{score}</span>
			</div>
		);
	}
}