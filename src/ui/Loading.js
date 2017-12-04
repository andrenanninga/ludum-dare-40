import React, { PureComponent } from 'react';
import { times } from 'lodash';

const style = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		zIndex: 10000,
		backgroundColor: '#55626f',
		fontFamily: '"Fredoka One", cursive',
		color: '#79bd9a',
		fontSize: 64,
	},
};

export default class extends PureComponent {
	state = {
		dots: 1,
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			const dots = this.state.dots < 3 ? this.state.dots + 1 : 0;
			this.setState({ dots })
		}, 600);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		const { dots } = this.state;
		return (
			<div style={style.container}>
				<span>loading{times(dots, () => '.')}</span>
			</div>
		);
	}
}