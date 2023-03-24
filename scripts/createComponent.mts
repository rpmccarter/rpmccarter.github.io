import tf from 'template-file'
import { mkdir, writeFile } from 'node:fs/promises'
import minimist from 'minimist'
import process from 'node:process'


const args = minimist(process.argv.slice(2))
if (args._.length !== 1) {
    throw new Error('must supply component name')
}
const componentName = args._[0]

const indexFileContents = await tf.renderFile('scripts/templates/indexTemplate.txt', {name: componentName})
const tsxFileContents = await tf.renderFile('scripts/templates/tsxTemplate.txt', {name: componentName})

await mkdir(`./src/components/${componentName}`)
await writeFile(`./src/components/${componentName}/index.tsx`, indexFileContents)
await writeFile(`./src/components/${componentName}/${componentName}.tsx`, tsxFileContents)
await writeFile(`./src/components/${componentName}/${componentName}.module.css`, '')