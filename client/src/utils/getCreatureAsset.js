const creatureImages2 = {
    "extra-small": {

    },
    "small": {
        0: {
            slime: '/assets/sprite-152/152x152 - littles.png',
            wolf: '/assets/sprite-152/152x152_noble.png',
            dragon: '/assets/sprite-152/152x152_mythic.png'
        },
        1: {
            slime: '/assets/sprite-152/152x152_baby slime.png',
            wolf: '/assets/sprite-152/152x152_baby emberwolf.png',
            dragon: '/assets/sprite-152/152x152 baby dragon.png'
        },
        2: {
            slime: '/assets/sprite-152/152x152_adult slime.png',
            wolf: '/assets/sprite-152/152x152_emberwolf.png',
            dragon: '/assets/sprite-152/152x152_dragon.png'
        } 
    },
    "medium": {
        0: {
            slime: '/assets/sprite-238/littles egg 238x238.png',
            wolf: '/assets/sprite-238/noble egg 238x238.png',
            dragon: '/assets/sprite-238/mythic egg 238x238.png'
        },
        1: {
            slime: '/assets/sprite-238/baby-slime-238x238.png',
            wolf: '/assets/sprite-238/basic-emberwolf-238x238.png',
            dragon: '/assets/sprite-238/basic-dragon-238x238.png'
        },
        2: {
            slime: '/assets/sprite-238/slime-adult-238x238.png',
            wolf: '/assets/sprite-238/emberwolf-238x238.png',
            dragon: '/assets/sprite-238/dragon-238x238.png'
        }
    }, 
    "large": {
        1: {
            slime: '/assets/sprite-322/baby slime 322x322.png',
            wolf: '/assets/sprite-322/baby emberfox 322x322.png',
            dragon: '/assets/sprite-322/baby dragon 322x322.png'
        },
        2: {
            slime: '/assets/sprite-322/adult slime 322x322.png',
            wolf: '/assets/sprite-322/emberwolf 322x322.png',
            dragon: '/assets/sprite-322/dragon 322x322.png'
        }
    },
    "extra-large": {
        0: {
            slime: '/assets/sprite-550/550x550 _littles',
            wolf: '/assets/sprite-550/550x550 _noble',
            dragon: '/assets/sprite-550/550x550_mythic',
        }
    }
}

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