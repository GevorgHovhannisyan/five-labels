export default {
  product: (state) => state.product,
  stickers: (state) => state.stickers,
  product_shape: (state) => state.shape,
  product_corner: (state) => state.corner,
  product_size: (state) => state.size,
  product_finish: (state) => state.finish,
  product_material: (state) => state.material,
  product_direction: (state) => state.direction,
  custom_quantity: (state) => state.custom_quantity,
  image_for_bulk: (state) => state.image_for_bulk,
  artwork_review_image: (state) => state.artwork_review_image,
  rotated_images: (state) => state.rotated_images,
  save_order_image: (state) => state.save_order_image,
  no_save_image: (state) => state.no_save_image,
  original_image: (state) => state.original_image,
  shapes: (state) => {
    if (state.shapes.length) {
      state.shapes.map((c) => {
        c.id = c.service_id
        c.label = c.name
      })
    }
    return state.shapes
  },
  corners: () => {
    return [
      { label: "Rounded", id: "rounded" },
      { label: "Sharp", id: "sharp" }
    ]
  },
  sizes: (state) => {
    if (state.sizes.length) {
      state.sizes.map((c) => {
        c.id = c.service_id
        c.label = c.name
      })
    }
    return state.sizes
  },
  finishes: (state) => {
    if (state.finishes.length) {
      state.finishes.map((c) => {
        c.id = c.service_id
        c.label = c.name
      })
    }
    return state.finishes
  },
  materials: (state) => {
    if (state.materials.length) {
      state.materials.map((c) => {
        c.id = c.service_id
        c.label = c.name
      })
    }
    return state.materials
  },
  directions: (state) => {
    if (state.directions.length) {
      state.directions.map((d) => {
        if (d.name.includes("#")) {
          const name = d.name.split(" ").slice(1).join(" ")
          d.number = d.name.split(" ")[0]

          d.name = name
        }
      })
    }

    return state.directions
  },
  quantities: (state) => {
    const list = state.quantities
    return list.filter((q) => q.name !== "Not Important")
  },
  quantity: (state) => state.quantity,
  zip_code: (state) => state.zip_code,
  order_image: (state) => state.order_image,
  calculate_data: (state) => {
    return state.calculate_data
  },
  edited_order: (state) => state.edited_order
}
