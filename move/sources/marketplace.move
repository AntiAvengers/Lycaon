module 0x0::marketplace {
    use 0x0::sprite_token;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::dynamic_field as ofield;

    const E_NOT_ENOUGH: u64 = 0;
    const E_NOT_OWNER: u64 = 1;
    const E_IS_OWNER: u64 = 2;

    //Struct for Listing
    public struct Listing has key {
        id: UID,
        sender: address,
        price: u64,
    }

    //Create Listing
    public fun create(sprite: sprite_token::Sprite, price: u64, ctx: &mut TxContext) {
        let mut listing = Listing {
            id: object::new(ctx),
            sender: ctx.sender(),
            price: price
        };
        ofield::add(&mut listing.id, b"sprite", sprite);
        transfer::share_object(listing);
    }

    //Purchase from Listing
    public fun buy(listing: Listing, mut payment: Coin<SUI>, ctx: &mut TxContext) {
        let Listing { mut id, sender, price } = listing;
        assert!(sender != ctx.sender(), E_IS_OWNER);
        assert!(coin::value(&payment) >= price, E_NOT_ENOUGH);
        let paid = coin::split(&mut payment, price, ctx);
        transfer::public_transfer(paid, sender);
        let sprite: sprite_token::Sprite = ofield::remove(&mut id, b"sprite");
        object::delete(id);
        transfer::public_transfer(sprite, ctx.sender());
        transfer::public_transfer(payment, ctx.sender());
    }

    //Cancel Listing if Owner
    public fun cancel(listing: Listing, ctx: &mut TxContext) {
        let Listing { mut id, sender, .. } = listing;
        assert!(sender == ctx.sender(), E_NOT_OWNER);
        let sprite: sprite_token::Sprite = ofield::remove(&mut id, b"sprite");
        object::delete(id);
        transfer::public_transfer(sprite, sender);
    }
}