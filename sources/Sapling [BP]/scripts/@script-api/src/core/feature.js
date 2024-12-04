export default class Feature {
    constructor(feature, packet) {
        feature.packet = packet;
        return feature;
    }
}