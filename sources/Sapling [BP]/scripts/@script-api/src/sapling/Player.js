export function CheckSaplingAdmin(player) {
    const isAdmin = player.hasTag('sapling_admin');
    return isAdmin;
}

export function getTextureChannel(player) {
    const tags = player.getTags().filter(t => t.includes('config:textureChannel:'));
    const parsedTags = (tags.length > 0) ? tags : [ '1' ];
    const textureChannel = parsedTags[0].replace('config:textureChannel:', '');

    return textureChannel;
}

export function getConfigValue(player, feature, defaultValue) {
    const tags = player.getTags().filter(t => t.includes(`config:${feature}:`));
    const parsedTags = (tags.length > 0) ? tags : [ defaultValue ];
    const configValue = parsedTags[0].replace(`config:${feature}:`, '');

    return configValue;
}