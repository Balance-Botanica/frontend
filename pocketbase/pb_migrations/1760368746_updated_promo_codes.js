/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("4ll8dlunb4ppidb")

  // update collection data
  unmarshal({
    "listRule": "is_active = true",
    "viewRule": "is_active = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("4ll8dlunb4ppidb")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
