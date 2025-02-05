// Add paths to default images on each sport
import badmintonImg from '$lib/assets/images/default/badminton.jpg';
import basketballImg from '$lib/assets/images/default/basketball.jpg';
import footballImg from '$lib/assets/images/default/football.jpg';
import tennisImg from '$lib/assets/images/default/tennis.jpg';
import cricketImg from '$lib/assets/images/default/cricket.jpg';
import hockeyImg from '$lib/assets/images/default/hockey.jpg';
import tabletennisImg from '$lib/assets/images/default/table tennis.jpg';
import volleyballImg from '$lib/assets/images/default/volleyball.jpg';
import throwballImg from '$lib/assets/images/default/throwball.jpg';
import ultimateFrisbeeImg from '$lib/assets/images/default/ultimate frisbee.jpg';
import skatingImg from '$lib/assets/images/default/skating.jpg';

export const defaultImages: { [key: string]: string } = {
	badminton: badmintonImg,
	basketball: basketballImg,
	football: footballImg,
	tennis: tennisImg,
	cricket: cricketImg,
	hockey: hockeyImg,
	'table tennis': tabletennisImg,
	volleyball: volleyballImg,
	throwball: throwballImg,
	'ultimate frisbee': ultimateFrisbeeImg,
	skating: skatingImg
};