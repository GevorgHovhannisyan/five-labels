const DIGIT_REG_EX = /-?[0-9]*\.?\d+/g
const MARKER_REG_EX = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g

export const svgPathToCommands = (str) => {
  const results = []
  let match
  while ((match = MARKER_REG_EX.exec(str)) !== null) {
    results.push(match)
  }

  return results
    .map((match) => {
      return {
        marker: str[match.index],
        index: match.index
      }
    })
    .reduceRight((all, cur) => {
      const chunk = str.substring(
        cur.index,
        all.length ? all[all.length - 1].index : str.length
      )
      return all.concat([
        {
          marker: cur.marker,
          index: cur.index,
          chunk: chunk.length > 0 ? chunk.substr(1, chunk.length - 1) : chunk
        }
      ])
    }, [])
    .reverse()
    .map((command) => {
      const values = command.chunk.match(DIGIT_REG_EX)
      return {
        marker: command.marker,
        values: values ? values.map(parseFloat) : []
      }
    })
}

export const drawSvgPath = (ctx, commandList) => {
  // ctx.save();
  ctx.beginPath()
  let lastPos = [0, 0]
  let pointOne, pointTwo
  commandList.forEach((command) => {
    switch (command.marker) {
      case "z":
      case "Z": {
        lastPos = [0, 0]
        ctx.closePath()
        break
      }
      case "m": {
        lastPos = [
          lastPos[0] + command.values[0],
          lastPos[1] + command.values[1]
        ]
        ctx.moveTo(lastPos[0], lastPos[1])
        break
      }
      case "l": {
        lastPos = [
          lastPos[0] + command.values[0],
          lastPos[1] + command.values[1]
        ]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "h": {
        lastPos = [lastPos[0] + command.values[0], lastPos[1]]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "v": {
        lastPos = [lastPos[0], lastPos[1] + command.values[0]]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "c": {
        pointOne = [
          lastPos[0] + command.values[0],
          lastPos[1] + command.values[1]
        ]
        pointTwo = [
          lastPos[0] + command.values[2],
          lastPos[1] + command.values[3]
        ]
        lastPos = [
          lastPos[0] + command.values[4],
          lastPos[1] + command.values[5]
        ]
        ctx.bezierCurveTo(
          pointOne[0],
          pointOne[1],
          pointTwo[0],
          pointTwo[1],
          lastPos[0],
          lastPos[1]
        )
        break
      }
      case "s": {
        pointOne = [
          lastPos[0] - pointTwo[0] + lastPos[0],
          lastPos[1] - pointTwo[1] + lastPos[1]
        ]
        pointTwo = [
          lastPos[0] + command.values[0],
          lastPos[1] + command.values[1]
        ]
        lastPos = [
          lastPos[0] + command.values[2],
          lastPos[1] + command.values[3]
        ]
        ctx.bezierCurveTo(
          pointOne[0],
          pointOne[1],
          pointTwo[0],
          pointTwo[1],
          lastPos[0],
          lastPos[1]
        )
        break
      }
      case "M": {
        lastPos = [command.values[0], command.values[1]]
        ctx.moveTo(lastPos[0], lastPos[1])
        break
      }
      case "L": {
        lastPos = [command.values[0], command.values[1]]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "H": {
        lastPos = [command.values[0], lastPos[1]]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "V": {
        lastPos = [lastPos[0], command.values[0]]
        ctx.lineTo(lastPos[0], lastPos[1])
        break
      }
      case "C": {
        pointOne = [command.values[0], command.values[1]]
        pointTwo = [command.values[2], command.values[3]]
        lastPos = [command.values[4], command.values[5]]
        ctx.bezierCurveTo(
          pointOne[0],
          pointOne[1],
          pointTwo[0],
          pointTwo[1],
          lastPos[0],
          lastPos[1]
        )
        break
      }
      case "S": {
        pointOne = [
          lastPos[0] - pointTwo[0] + lastPos[0],
          lastPos[1] - pointTwo[1] + lastPos[1]
        ]
        pointTwo = [command.values[0], command.values[1]]
        lastPos = [command.values[2], command.values[3]]
        ctx.bezierCurveTo(
          pointOne[0],
          pointOne[1],
          pointTwo[0],
          pointTwo[1],
          lastPos[0],
          lastPos[1]
        )
        break
      }
      default:
        ""
    }
  })

  ctx.stroke()
  // ctx.restore();
}
