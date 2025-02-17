import { Player as Lottie } from '@lottiefiles/react-lottie-player'
import Cards from './Cards.json'
import Confirmed from './Confirmed.json'
import Pay from './Pay.json'

export const MusicComponent = () => (
    <div>
        <Lottie
            hover
            style={{
                height: '100px'
            }}
            loop={true}
            src={Cards}
        /></div>
);
export const Confirm = () => (
    <div>
        <Lottie
            hover
            style={{
                height: '100px'
            }}
            loop={true}
            src={Confirmed}
        /></div>
);
export const Paying = () => (
    <div>
        <Lottie
            hover
            style={{
                height: '100px'
            }}
            loop={true}
            src={Pay}
        /></div>
);