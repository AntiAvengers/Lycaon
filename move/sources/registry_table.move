module 0x0::registry_table {
    use sui::bcs;
    use sui::table::{Self, Table};

    public struct UUIDRegistry has key, store {
        id: UID,
        table: Table<vector<u8>, u64>,
    }

    fun init(ctx: &mut TxContext) {
        transfer::public_share_object(
            UUIDRegistry { 
                id: object::new(ctx),
                table: table::new<vector<u8>, u64>(ctx)
            }
        );
    }

    public fun check(entry: &mut UUIDRegistry, uuid: vector<u8>): bool {
        let UUIDRegistry { id: _, table } = entry;
        table.contains(uuid)
    }

    public fun add(entry: &mut UUIDRegistry, uuid: vector<u8>, expiration: u64) {
        let UUIDRegistry { id: _, table } = entry;
        assert!(!table.contains(uuid), 0);
        table.add(uuid, expiration);
    }

    public fun remove_batch(entry: &mut UUIDRegistry, uuid_list: vector<u8>) {
        let UUIDRegistry { id: _, table } = entry;

        let mut bcs = bcs::new(uuid_list);

        let mut len = bcs.peel_vec_length();

        while (len > 0) {
            table.remove(bcs.peel_vec_u8());
            len = len - 1;
        };
    }
}