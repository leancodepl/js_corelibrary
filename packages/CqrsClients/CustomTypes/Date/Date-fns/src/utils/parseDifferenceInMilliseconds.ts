export default function parseDifferenceInMilliseconds(differenceInMilliseconds: number) {
    const milliseconds = differenceInMilliseconds % 1000;
    const seconds = Math.floor((differenceInMilliseconds / 1000) % 60);
    const minutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return { milliseconds, seconds, minutes, hours, days };
}
