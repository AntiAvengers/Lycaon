module wallet_address::sprite_token {
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    struct Sprite has key {
        id: UID,
        metadata_url: vector<u8>,
    }

    public fun mint(ctx: &mut TxContext, metadata_url: vector<u8>): Sprite {
        let id = object::new(ctx);
        Sprite { id, metadata_url }
    }

    public fun transfer_token(token: Sprite, recipient: address) {
        transfer::transfer(token, recipient);
    }
}
