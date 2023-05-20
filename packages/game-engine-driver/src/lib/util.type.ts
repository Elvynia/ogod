// TODO: Use in driver game engine state$ for StateObservable keys.
export type NestedKeyOf<ObjectType extends object> =
    { [Key in keyof ObjectType & string]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : Key
    }[keyof ObjectType & string];