module 0x0::sprite_token {
    public struct Sprite has key {
        id: UID,
        hashed_metadata: vector<u8>,
    }

    public fun mint(ctx: &mut TxContext, hashed_metadata: vector<u8>): Sprite {
        let id = object::new(ctx);
        let sprite = Sprite { id, hashed_metadata };
        transfer::transfer(sprite, recipient);
    }

    public fun transfer_token(token: Sprite, recipient: address) {
        transfer::transfer(token, recipient);
    }    
}
