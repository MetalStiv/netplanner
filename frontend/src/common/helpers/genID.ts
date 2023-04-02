export default function genID(length: number) {
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace('.', ''));
}