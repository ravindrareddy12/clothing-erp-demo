// Shared schema plugin: keeps the JSON API contract as { id, ...fields }
// instead of Mongoose's default { _id, __v, ... }, so routes and the
// frontend don't need to change when swapping the in-memory store for Mongo.
export function withIdJSON(schema) {
  schema.set("toJSON", {
    virtuals: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  });
}
