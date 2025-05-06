const creatureImages = {
    //egg
    0: {
        slime: '/assets/sprites/slime-sprite.gif'
    },
    //sprite
    1: {
        slime: '/assets/sprites/slime-sprite.gif',
        wolf: '/assets/sprites/celestial-sprite.png',
    },
    //evolved sprite
    2: {
        slime: '/assets/sprites/slime-sprite.gif'
    }  
};

const creatureStillImages = {
    //egg
    0: {
        slime: '/assets/stillSprites/still-slime.svg'
    },
    //sprite
    1: {
        slime: '/assets/stillSprites/still-slime.svg',
    },
    //evolved sprite
    2: {
        slime: '/assets/stillSprites/still-slime.svg'
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