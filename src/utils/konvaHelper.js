/* eslint-disable */

import Konva from "konva"
import { drawSvgPath, svgPathToCommands } from "./svgUtils"
let stage
let layer
let groupNode
let cropImageTransformer
let stageWidth = 400
let stageHeight = 400
let imageNode
let workWidth = 400 / 4
let workHeight = 400 / 4

let fiw
let fih
let shape_type

let widthConstant
let heigthConstant

export const setupCanvas = (containerId) => {
  stage = new Konva.Stage({
    container: containerId,
    width: stageWidth,
    height: stageHeight
  })

  layer = new Konva.Layer()
  stage.add(layer)
  return { stage, layer }
}

export const addCropeGroupNode = (layer, svgPath, shape) => {
  shape_type = shape

  const commandList = svgPathToCommands(svgPath)
  groupNode = new Konva.Group({
    x: 23,
    y: 25,
    scaleX: 3.5,
    scaleY: 3.5,
    clipFunc: function (ctx) {
      ctx.lineWidth = 1 / 9
      drawSvgPath(ctx, commandList)
    },
    draggable: true
  })
  layer.add(groupNode)

  return groupNode
}

export const addImageNode = (parrent, image) => {
  widthConstant = image.width
  heigthConstant = image.height

  let iw = image.width
  let ih = image.height
  fiw = iw
  fih = ih

  let stageMax = Math.max(workWidth, workHeight)
  let ratio = 1
  if (Math.max(iw, ih) > stageMax) {
    if (iw > workWidth) {
      ratio = iw / workWidth
    }
    if (ih > workHeight) {
      ratio = ih / workHeight
    }
    fiw = Math.round(iw / ratio)
    fih = Math.round(ih / ratio)
  }

  // y: fih / 2,
  imageNode = new Konva.Image({
    y: fih / 2 > 50 ? fih / 2 : 50,
    x: workWidth / 2,
    image: image,
    width: fiw,
    height: fih,
    scaleX: 1 / 3,
    scaleY: 1 / 3,
    offsetX: fiw / 2,
    offsetY: fih / 2,
    draggable: true
  })

  widthConstant = imageNode.width()
  heigthConstant = imageNode.height()

  groupNode.add(imageNode)

  return imageNode
}

export const addTransformer = (childNode) => {
  cropImageTransformer = new Konva.Transformer({
    rotateEnabled: false,
    borderStroke: "#373435",
    anchorStroke: "#373435",
    anchorFill: "#373435",
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"]
  })
  cropImageTransformer.nodes([childNode])
  layer.add(cropImageTransformer)
}
export const centerVertical = () => {
  imageNode.setAttrs({
    y: 50
  })
}
export const centerHorizontal = () => {
  imageNode.setAttrs({
    x: workWidth / 2
  })
}
export const fitImage = () => {
  let fitWidth
  let fitHeigth

  let maxHeight = 150

  if (shape_type === "rectangle") {
    maxHeight = 150
  } else if (shape_type === "circule") {
    maxHeight = 300
  } else if (shape_type === "elips") {
    maxHeight = 150
  } else if (shape_type === "squeare") {
    maxHeight = 300
  }
  const w = widthConstant
  const h = heigthConstant
  if (w > h) {
    if (w < 300) {
      const ratio = w / h
      const diff = 300 - w
      fitWidth = w + diff
      if (h + diff / ratio > maxHeight) {
        fitHeigth = maxHeight
        const diffHeight = maxHeight - h
        fitWidth = w + diffHeight * ratio
      } else {
        fitHeigth = h + diff / ratio
      }
    }
  } else {
    if (h < maxHeight) {
      const ratio = h / w
      const diff = maxHeight - h
      fitHeigth = h + diff
      if (h + diff / ratio > maxHeight) {
        fitWidth = 300
        const diffHeight = 300 - w
        fitHeigth = h + diffHeight * ratio
      } else {
        fitWidth = w + diff / ratio
      }
    }
  }

  // fitHeigth / 2 > 50 ? fitHeigth / 2 : 50
  imageNode.setAttrs({
    y: 50.5,
    x: workWidth / 2,
    scaleX: 1 / 3,
    scaleY: 1 / 3,
    offsetX: fitWidth / 2,
    offsetY: fitHeigth / 2,
    width: fitWidth,
    height: fitHeigth
  })
}

export const rotateImageDeg = () => {
  imageNode.rotate(45)
}

export const cropImage = (name) => {
  cropImageTransformer.destroy()
  var toDataURL = stage.toDataURL({
    mimeType: "image/png",
    quality: 1.0
  })

  var arr = toDataURL.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  setTimeout(() => {
    addTransformer(imageNode)
  }, 10)
  const new_file = new File([u8arr], name, { type: mime })
  return { new_file }
}

var stage_roll
var layer_roll
var imageEmpty
var imageRoll
export const setupCanvasRoll = (roll_sizes) => {
  stage_roll = new Konva.Stage({
    container: roll_sizes,
    width: 200,
    height: 180
  })
  layer_roll = new Konva.Layer({
    x: 0,
    y: 0,
    scaleX: 4,
    scaleY: 4
  })

  stage_roll.add(layer_roll)
  return { stage_roll, layer_roll }
}

export const addImage = (rotatedEmptyRolls, cropImageFile) => {
  const rotatedImages = []

  let rotate_angles = 270

  imageEmpty = new Konva.Image({
    y: 1,
    x: 1,
    image: rotatedEmptyRolls[0],
    scaleX: 1 / 2,
    scaleY: 1 / 2
  })

  imageRoll = new Konva.Image({
    y: 32,
    x: 15,
    scaleX: 1 / 17,
    scaleY: 1 / 17,
    rotation: rotate_angles,
    image: cropImageFile,
    offsetX: cropImageFile.width / 2,
    offsetY: cropImageFile.height / 2
  })

  layer_roll.add(imageEmpty)
  layer_roll.add(imageRoll)

  // ###########        Top first
  const rotateImageTopF = layer_roll.toDataURL({
    mimeType: "image/png",
    quality: 1.0
  })
  const imageRotated = rotateSave(rotateImageTopF)

  rotatedImages.push({
    id: 16,
    title: "Top first",
    src: URL.createObjectURL(imageRotated),
    file: imageRotated
  })

  imageRoll.rotate(90)
  imageRoll.setX(17)

  layer_roll.add(imageRoll)

  layer_roll.draw()

  // ###########        Left side first

  const rotateImageLeftF = layer_roll.toDataURL({
    mimeType: "image/png",
    quality: 1.0
  })
  const imageRotatedLeftF = rotateSave(rotateImageLeftF)

  rotatedImages.push({
    id: 19,
    title: "Left side first",
    src: URL.createObjectURL(imageRotatedLeftF),
    file: imageRotatedLeftF
  })

  imageEmpty.destroy()
  imageRoll.destroy()
  /////////////////////////////

  // ###########        Rigth side first

  imageEmpty = new Konva.Image({
    y: 1,
    x: 1,
    image: rotatedEmptyRolls[1],
    scaleX: 1 / 2,
    scaleY: 1 / 2
  })

  imageRoll = new Konva.Image({
    y: 32,
    x: 35,
    scaleX: 1 / 17,
    scaleY: 1 / 17,
    rotation: 270,
    image: cropImageFile,
    offsetX: cropImageFile.width / 2,
    offsetY: cropImageFile.height / 2
  })

  layer_roll.add(imageEmpty)
  layer_roll.add(imageRoll)

  layer_roll.draw()

  // layer_roll.draw()

  const rotateImageRightF = layer_roll.toDataURL({
    mimeType: "image/png",
    quality: 1.0
  })
  const imageRotatedRightF = rotateSave(rotateImageRightF)

  rotatedImages.push({
    id: 18,
    title: "Right side first",
    src: URL.createObjectURL(imageRotatedRightF),
    file: imageRotatedRightF
  })

  imageRoll.rotate(90)
  imageRoll.setX(33)

  layer_roll.add(imageRoll)

  layer_roll.draw()

  // ###########        Left side first

  const rotateImageBottomF = layer_roll.toDataURL({
    mimeType: "image/png",
    quality: 1.0
  })
  const imageRotatedBottomF = rotateSave(rotateImageBottomF)

  rotatedImages.push({
    id: 17,
    title: "Bottom first",
    src: URL.createObjectURL(imageRotatedBottomF),
    file: imageRotatedBottomF
  })

  return { rotatedImages }

  let rotateAngle = 0
  let title = ""
  setTimeout(() => {
    layer_roll.add(imageEmpty)
    layer_roll.add(imageRoll)

    for (let i = 0; i < 4; i++) {
      var id
      imageRoll.rotate(rotateAngle)

      const rotateImage = layer_roll.toDataURL({
        mimeType: "image/png",
        quality: 1.0
      })
      const imageRotated = rotateSave(rotateImage)
      rotateAngle += 90

      if (i === 0) {
        title = "Top first"
        id = 16
      } else if (i === 1) {
        title = "Right side first"
        id = 18
      } else if (i === 2) {
        title = "Left side first"
        id = 19
      } else if (i === 3) {
        title = "Bottom first"
        id = 17
      }
      rotatedImages.push({
        id,
        title,
        src: URL.createObjectURL(imageRotated),
        file: imageRotated
      })
    }
  }, 100)
  layer_roll.draw()
  return { rotatedImages }
}

function rotateSave(toDataURL) {
  var arr = toDataURL.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const file = new File([u8arr], "order_image", { type: mime })
  return file
}
