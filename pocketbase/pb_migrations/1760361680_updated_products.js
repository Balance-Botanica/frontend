/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1843675174",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4156564586",
    "max": 0,
    "min": 0,
    "name": "size",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3156554836",
    "max": 0,
    "min": 0,
    "name": "flavor",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": null,
    "name": "price",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number1261852256",
    "max": null,
    "min": null,
    "name": "stock",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "json989021800",
    "maxSize": 0,
    "name": "categories",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3635338559",
    "maxSize": 0,
    "name": "image_urls",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "date2990389176",
    "max": "",
    "min": "",
    "name": "created",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date3332085495",
    "max": "",
    "min": "",
    "name": "updated",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("text1843675174")

  // remove field
  collection.fields.removeById("text4156564586")

  // remove field
  collection.fields.removeById("text3156554836")

  // remove field
  collection.fields.removeById("number3402113753")

  // remove field
  collection.fields.removeById("number1261852256")

  // remove field
  collection.fields.removeById("json989021800")

  // remove field
  collection.fields.removeById("json3635338559")

  // remove field
  collection.fields.removeById("date2990389176")

  // remove field
  collection.fields.removeById("date3332085495")

  return app.save(collection)
})
