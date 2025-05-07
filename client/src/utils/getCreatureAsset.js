const creatureImages = {
    //egg
    0: {
        slime: '/assets/sprites/eggs_0002.png',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    },
    //sprite
    1: {
        slime: '/assets/sprites/slime-sprite.gif',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    },
    //evolved sprite
    2: {
        slime: '/assets/sprites/slime-sprite.gif',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    }  
};

const creatureStillImages = {
    //egg
    0: {
        slime: '/assets/stillSprites/still-slime.svg',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    },
    //sprite
    1: {
        slime: '/assets/stillSprites/still-slime.svg',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    },
    //evolved sprite
    2: {
        slime: '/assets/stillSprites/still-slime.svg',
        familiar_placeholder: '/assets/sprites/eggs_0003.png',
        noble_placeholder: '/assets/sprites/eggs_0004.png',
        elite_placeholder: '/assets/sprites/eggs_0005.png',
        mythic_placeholder: '/assets/sprites/eggs_0006.png'
    }  
}

export function getCreatureImage(creature_type, stage) {
    const type = creature_type.toLowerCase().trim();
    return creatureImages[stage][type] || '/assets/star.png';
}

export function getCreatureStillImage(creature_type, stage) {
    const type = creature_type.toLowerCase().trim();
    return creatureStillImages[stage][type] || '/assets/star.png';
}