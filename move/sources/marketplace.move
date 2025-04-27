module 0x0::marketplace {
    use 0x0::sprite_token;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    // use sui::balance::{Self, Balance};

    const ENotEnough: u64 = 0;

    //Struct for Listing
    public struct Listing has key {
        id: UID,
        sender: address,
        sprite: sprite_token::Sprite,
        price: u64,
    }

    //Create Listing
    public fun create(sprite: sprite_token::Sprite, price: u64, ctx: &mut TxContext) {
        transfer::share_object(Listing { 
            id: object::new(ctx),
            sender: ctx.sender(),
            sprite: sprite,
            price: price
        });
    }

    //Purchase from Listing
    public fun buy(listing: Listing, payment: &mut Coin<SUI>, ctx: &mut TxContext) {
        let Listing { id, sender, sprite, price } = listing;
        assert!(coin::value(payment) >= price, ENotEnough);

        let paid = coin::split(payment, price, ctx);

        // transfer::transfer(sprite, ctx.sender());
        transfer::public_transfer(sprite, ctx.sender());
        // sprite_token::transfer_token(sprite, ctx.sender());
        transfer::public_transfer(paid, sender);
        object::delete(id);
    }

    //Cancel
    public fun cancel(listing: Listing, ctx: &mut TxContext) {
        let Listing { id, sender, sprite, .. } = listing;
        assert!(sender == ctx.sender());
        // transfer::transfer(sprite, sender);
        transfer::public_transfer(sprite, sender);
        // sprite_token::transfer_token(sprite, sender);
        object::delete(id);
    }
}