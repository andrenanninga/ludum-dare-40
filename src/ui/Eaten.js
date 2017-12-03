import React, { PureComponent } from 'react';

const style = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		top: 32,
		left: 48,
		fontFamily: '"Fredoka One", cursive',
		color: '#79bd9a',
	},

	text: {
		fontSize: 24,
		marginLeft: 8,
	},

	score: {
		fontSize: 36,
	}
};



export default class extends PureComponent {
	render() {
		const { eaten, hunger } = this.props;
		const isHungry = eaten < hunger;

		return (
			<div style={style.container}>
				{isHungry && <span style={style.score}>{eaten}/{hunger}</span>}
				{isHungry && <span style={style.text}> - eaten</span>}
				{!isHungry && <span style={style.score}>full!</span>}
			</div>
		);
	}
}