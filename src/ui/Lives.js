import React, { PureComponent } from 'react';
import { times } from 'lodash';

const style = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		top: 32,
		left: 64,
		right: 64,
	},

	heart: {
		margin: 6,
		width: 14 * 2,
		height: 13 * 2,
		imageRendering: 'auto',
		imageRendering: 'crisp-edges',
		imageRendering: 'pixelated',
	},
};



export default class extends PureComponent {
	render() {
		const { lives, hearts } = this.props;

		return (
			<div style={style.container}>
				{times(hearts, (i) => (
					<img
						src={i < lives ? 'assets/images/heart-full.png' : 'assets/images/heart-empty.png'}
						style={style.heart}
					/>
				))}
			</div>
		);
	}
}