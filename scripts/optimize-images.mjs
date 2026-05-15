import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const ROOTS = ['public/products', 'public/production']
const MAX_WIDTH = 1200
const QUALITY = 78
const TARGET_BYTES = 100 * 1024

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (entry.isFile() && /\.jpe?g$/i.test(extname(entry.name))) yield path
  }
}

function fmt(bytes) {
  return (bytes / 1024).toFixed(0) + ' KB'
}

let totalBefore = 0
let totalAfter = 0
let count = 0
let warned = 0

for (const root of ROOTS) {
  try {
    await stat(root)
  } catch {
    console.log(`skip: ${root} not found`)
    continue
  }

  for await (const file of walk(root)) {
    const input = await readFile(file)
    const before = input.length

    let quality = QUALITY
    let output
    do {
      output = await sharp(input)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true, progressive: true })
        .toBuffer()
      quality -= 6
    } while (output.length > TARGET_BYTES && quality >= 50)

    await writeFile(file, output)
    totalBefore += before
    totalAfter += output.length
    count++

    const tag = output.length > TARGET_BYTES ? ' ⚠ over target' : ''
    if (output.length > TARGET_BYTES) warned++
    console.log(`${file}: ${fmt(before)} → ${fmt(output.length)}${tag}`)
  }
}

console.log('')
console.log(`Done: ${count} files, ${fmt(totalBefore)} → ${fmt(totalAfter)} (saved ${fmt(totalBefore - totalAfter)})`)
if (warned) console.log(`${warned} file(s) above ${fmt(TARGET_BYTES)} target — consider lower MAX_WIDTH or manual recompression.`)
