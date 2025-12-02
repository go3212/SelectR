import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '..', 'public', 'icons')

// Simple PNG generator for solid color icons with < > / symbols
// This creates minimal valid PNGs

function createPNG(size) {
  const pixels = []
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.45

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Check if within rounded rect
      const cornerRadius = size * 0.2
      let inRect = true
      
      // Check corners
      if (x < cornerRadius && y < cornerRadius) {
        const dx = x - cornerRadius
        const dy = y - cornerRadius
        inRect = Math.sqrt(dx * dx + dy * dy) <= cornerRadius
      } else if (x >= size - cornerRadius && y < cornerRadius) {
        const dx = x - (size - cornerRadius)
        const dy = y - cornerRadius
        inRect = Math.sqrt(dx * dx + dy * dy) <= cornerRadius
      } else if (x < cornerRadius && y >= size - cornerRadius) {
        const dx = x - cornerRadius
        const dy = y - (size - cornerRadius)
        inRect = Math.sqrt(dx * dx + dy * dy) <= cornerRadius
      } else if (x >= size - cornerRadius && y >= size - cornerRadius) {
        const dx = x - (size - cornerRadius)
        const dy = y - (size - cornerRadius)
        inRect = Math.sqrt(dx * dx + dy * dy) <= cornerRadius
      }

      if (inRect) {
        // Gradient from top-left (#10b981) to bottom-right (#059669)
        const t = (x + y) / (2 * size)
        const r = Math.round(16 + (5 - 16) * t)
        const g = Math.round(185 + (150 - 185) * t)
        const b = Math.round(129 + (105 - 129) * t)
        pixels.push(r, g, b, 255)
      } else {
        pixels.push(0, 0, 0, 0)
      }
    }
  }

  // Draw the </ > symbol in white
  const lineWidth = Math.max(1, Math.floor(size / 16))
  
  // Helper to draw a thick line
  function drawLine(x1, y1, x2, y2) {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const px = Math.round(x1 + (x2 - x1) * t)
      const py = Math.round(y1 + (y2 - y1) * t)
      
      for (let dx = -lineWidth; dx <= lineWidth; dx++) {
        for (let dy = -lineWidth; dy <= lineWidth; dy++) {
          const nx = px + dx
          const ny = py + dy
          if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
            const idx = (ny * size + nx) * 4
            if (pixels[idx + 3] > 0) { // Only draw on non-transparent pixels
              pixels[idx] = 255
              pixels[idx + 1] = 255
              pixels[idx + 2] = 255
            }
          }
        }
      }
    }
  }

  // Draw < on left
  const leftX = size * 0.15
  const midY = size * 0.5
  const arrowW = size * 0.15
  const arrowH = size * 0.2
  drawLine(leftX + arrowW, midY - arrowH, leftX, midY)
  drawLine(leftX, midY, leftX + arrowW, midY + arrowH)

  // Draw > on right
  const rightX = size * 0.85
  drawLine(rightX - arrowW, midY - arrowH, rightX, midY)
  drawLine(rightX, midY, rightX - arrowW, midY + arrowH)

  // Draw / in middle
  const slashTop = size * 0.25
  const slashBottom = size * 0.75
  const slashLeft = size * 0.55
  const slashRight = size * 0.45
  drawLine(slashLeft, slashTop, slashRight, slashBottom)

  return Buffer.from(pixels)
}

// Create a proper PNG file with zlib
import zlib from 'zlib'

function makePNG(size) {
  const pixels = createPNG(size)
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)  // width
  ihdr.writeUInt32BE(size, 4)  // height
  ihdr.writeUInt8(8, 8)        // bit depth
  ihdr.writeUInt8(6, 9)        // color type (RGBA)
  ihdr.writeUInt8(0, 10)       // compression
  ihdr.writeUInt8(0, 11)       // filter
  ihdr.writeUInt8(0, 12)       // interlace
  
  const ihdrChunk = makeChunk('IHDR', ihdr)
  
  // IDAT chunk (image data)
  // Add filter byte (0) to each row
  const rawData = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    rawData[y * (size * 4 + 1)] = 0 // filter byte
    pixels.copy(rawData, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  
  const compressed = zlib.deflateSync(rawData, { level: 9 })
  const idatChunk = makeChunk('IDAT', compressed)
  
  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  
  const typeBuffer = Buffer.from(type)
  const crcData = Buffer.concat([typeBuffer, data])
  const crc = crc32(crcData)
  
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc, 0)
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

// CRC32 implementation
function crc32(data) {
  let crc = 0xffffffff
  const table = []
  
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    }
    table[i] = c
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  
  return (crc ^ 0xffffffff) >>> 0
}

// Generate icons
const sizes = [16, 48, 128]

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

for (const size of sizes) {
  const png = makePNG(size)
  const filename = path.join(iconsDir, `icon${size}.png`)
  fs.writeFileSync(filename, png)
  console.log(`Generated ${filename}`)
}

console.log('Done!')

