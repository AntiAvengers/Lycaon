const creatureImages = {
    "120": {
        0: {
            slime: '/assets/sprite-120/Little egg 120x120.png',
            cat: '/assets/sprite-120/Familiar Egg 120x120.png',
            wolf: '/assets/sprite-120/Noble egg 120x120.png',
            deer: '/assets/sprite-120/Eliteegg 120x120.png',
            dragon: '/assets/sprite-120/Mythic egg 120x120.png',
        }
    },
    "152": {
        0: {
            slime: '/assets/sprite-152/Little 152x152.png',
            cat: '/assets/sprite-152/Familar 152x152.png',
            wolf: '/assets/sprite-152/Noble 152x152.png',
            deer: '/assets/sprite-152/Elite152x152.png',
            dragon: '/assets/sprite-152/Mythic 152x152.png'
        },
        1: {
            slime: '/assets/sprite-152/Slime 152x152.png',
            cat: '/assets/sprite-152/kitty - 152x152 .png',
            wolf: '/assets/sprite-152/Wolfy 152x152.png',
            deer: '/assets/sprite-152/Glacy -152x152 .png',
            dragon: '/assets/sprite-152/Lumi 152x152 .png'
        },
        2: {
            slime: '/assets/sprite-152/Big Slime 152x152.png',
            cat: '/assets/sprite-152/Cat - 152x152.png',
            wolf: '/assets/sprite-152/Emberwolf 152x152.png',
            deer: '/assets/sprite-152/Glacielle - 152x152.png',
            dragon: '/assets/sprite-152/Luminara 152x152.png'
        } 
    },
    "200": {
        0: {
            slime: '/assets/sprite-200/Little egg 200x200.png',
            cat: '/assets/sprite-200/familiar 200x200.png',
            wolf: '/assets/sprite-200/Noble egg 200x200.png',
            deer: '/assets/sprite-200/Elite egg egg 200x200.png',
            dragon: '/assets/sprite-200/Mythic egg 200x200.png',
        }
    },
    "238": {
        0: {
            slime: '/assets/sprite-238/Little 238x238.png',
            cat: '/assets/sprite-238/Familiar 238x238.png',
            wolf: '/assets/sprite-238/Noble 238x238.png',
            deer: '/assets/sprite-238/Elite 238x238.png',
            dragon: '/assets/sprite-238/MYthic 238x238.png'
        },
        1: {
            slime: '/assets/sprite-238/Slime 238x238.png',
            cat: '/assets/sprite-238/Kitty 238x238.png',
            wolf: '/assets/sprite-238/Wolfy 238x238.png',
            deer: '/assets/sprite-238/Glacy - 238x238.png',
            dragon: '/assets/sprite-238/Lumi 238x238.png'
        },
        2: {
            slime: '/assets/sprite-238/Big Slime 238x238.png',
            cat: '/assets/sprite-238/Cat 238x238 .png',
            wolf: '/assets/sprite-238/Emberwolf 238x238.png',
            deer: '/assets/sprite-238/Glacielle 238x238.png',
            dragon: '/assets/sprite-238/Luminara 238x238.png'
        }
    }, 
    "322": {
        0: {
            slime: '/assets/sprite-322/Little 322x322 .png',
            cat: '/assets/sprite-322/Familiar 322x322 .png',
            wolf: '/assets/sprite-322/Noble 322x322.png',
            deer: '/assets/sprite-322/Elite 322x322.png',
            dragon: '/assets/sprite-322/Mythic 322x322.png',
        },
        1: {
            slime: '/assets/sprite-322/Slime 322x322.png',
            cat: '/assets/sprite-322/Kittne 322x322.png',
            wolf: '/assets/sprite-322/Wolfy 322x322.png',
            deer: '/assets/sprite-322/Glacy - 322x322.png',
            dragon: '/assets/sprite-322/Lumi 322x322.png',
        },
        2: {
            slime: '/assets/sprite-322/Big slime 322x322.png',
            cat: '/assets/sprite-322/cat 322x322.png',
            wolf: '/assets/sprite-322/emberwolf 322x322.png',
            deer: '/assets/sprite-322/Glacielle 322x322.png',
            dragon: '/assets/sprite-322/Luminara322x322.png',
        }
    },
    "550": {
        0: {
            slime: '/assets/sprite-550/Littles 550x550.png',
            cat: '/assets/sprite-550/Familiar 550x550.png',
            wolf: '/assets/sprite-550/Noble 550x550 .png',
            deer: '/assets/sprite-550/Elite 550x550.png',
            dragon: '/assets/sprite-550/Mythic 550x550.png',
        },
        1: {
            slime: '/assets/sprite-550/Slime 550x550.png',
            cat: '/assets/sprite-550/kitty - 550x550.png',
            wolf: '/assets/sprite-550/Wolfy 550x550.png',
            deer: '/assets/sprite-550/Glacy - 550x550.png',
            dragon: '/assets/sprite-550/Lumi 550x550 .png',
        },
        2: {
            slime: '/assets/sprite-550/Big Slime 550x550.png',
            cat: '/assets/sprite-550/Cat - 550x550.png',
            wolf: '/assets/sprite-550/Emberwolf 550x550.png',
            deer: '/assets/sprite-550/Glacielle - 550x550 .png',
            dragon: '/assets/sprite-550/Lumnara 550x550.png',
        }
    },
    "GIF": {
        0: {
            slime: '/assets/sprite-322/Little 322x322 .png',
            cat: '/assets/sprite-322/Familiar 322x322 .png',
            wolf: '/assets/sprite-322/Noble 322x322.png',
            deer: '/assets/sprite-322/Elite 322x322.png',
            dragon: '/assets/sprite-322/Mythic 322x322.png',
        },
        1: {
            slime: '/assets/sprite-gif/slime.gif',
            cat: '/assets/sprite-322/Kittne 322x322.png',
            wolf: '/assets/sprite-322/Wolfy 322x322.png',
            deer: '/assets/sprite-322/Glacy - 322x322.png',
            dragon: '/assets/sprite-322/Lumi 322x322.png',
        },
        2: {
            slime: '/assets/sprite-gif/big-slime.png',
            cat: '/assets/sprite-322/cat 322x322.png',
            wolf: '/assets/sprite-gif/emberfang.png',
            deer: '/assets/sprite-322/Glacielle 322x322.png',
            dragon: '/assets/sprite-gif/luminara.png',
        }
    }
}

export function getCreatureImage(creature_size, creature_type, stage) {
    const size = creature_size.toString();
    const type = creature_type.toLowerCase().trim();
    return creatureImages[size][stage][type] || '/assets/star.png';
}

export function getCreatureStillImage(creature_size, creature_type, stage) {
    const size = creature_size.toString();
    const type = creature_type.toLowerCase().trim();
    return creatureImages[size][stage][type] || '/assets/star.png';
}