import tf from 'template-file'
import { mkdir, writeFile } from 'node:fs/promises'
import minimist from 'minimist'
import process from 'node:process'


const args = minimist(process.argv.slice(2))
if (args._.length !== 1) {
    throw new Error('must supply component name')
}
const componentName = args._[0]

const tsxTemplate = `import { FC } from "react"

type {{name}}Props = {

}

const {{name}}: FC<{{name}}Props> = () => {
    return (
        <></>
    )
}

export default {{name}}`

const tsxFileContents = tf.render(tsxTemplate, {name: componentName})

await mkdir(`./src/components/${componentName}`)
await writeFile(`./src/components/${componentName}/index.tsx`, tsxFileContents)
await writeFile(`./src/components/${componentName}/index.module.css`, '')