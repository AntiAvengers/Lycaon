module 0x0::sprite_token {
    use 0x0::registry_table;

    use std::string::{Self};
    use sui::ed25519;
    use sui::bcs;
    use sui::clock::{Clock};

    public struct Sprite has key, store {
        id: UID,
        sprite_type: string::String,
        sprite_rarity: string::String, 
        sprite_stage: string::String,
    }

    public fun mint(message: vector<u8>, signature: vector<u8>, public_key: vector<u8>, admin: &mut registry_table::UUIDRegistry, clock: &Clock, ctx: &mut TxContext) {
        //Check if the signature is valid
        let verify = ed25519::ed25519_verify(&signature, &public_key, &message);
        assert!(verify == true, 2);

        //Deserialize the original message
        let mut ticket = bcs::new(message);
        let (uuid, expiration, sprite_type, sprite_rarity, sprite_stage) = (
            ticket.peel_vec_u8(),
            ticket.peel_u64(),
            ticket.peel_vec_u8(),
            ticket.peel_vec_u8(),
            ticket.peel_vec_u8(),
        );

        //Check if the expiration time has passed
        let time = clock.timestamp_ms();
        assert!(time < expiration, 3);

        //Check if the UUID has already been used
        let check = registry_table::check(admin, uuid);
        assert!(!check, 1);

        //Push UUID and expiration to the table
        registry_table::add(admin, uuid, expiration);

        let sprite = Sprite {
            id: object::new(ctx),
            sprite_type: sprite_type.to_string(),
            sprite_rarity: sprite_rarity.to_string(),
            sprite_stage: sprite_stage.to_string()
        };
        let sender = ctx.sender();
        transfer::transfer(sprite, sender);
    }

    public fun transfer_token(token: Sprite, recipient: address) {
        transfer::transfer(token, recipient);
    }
}
