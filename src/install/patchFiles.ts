import { join } from 'path'

import { FilePatcher } from '../utils/filePatcher'
import config from '../config'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const filePatcher = new FilePatcher({ logPrefix: __filename })

  await filePatcher.patchFiles({
    patchList: [
      {
        onFile: ({ content }) => ({
          newContent: FilePatcher.utils.patchStringContent({
            content,
            stringMatch: `process(input: string, filePath: Config.Path, jestConfig: Config.ProjectConfig, transformOptions?: TransformOptions): TransformedSource | string;`,
            stringReplace: `process(input: string, filePath: Config.Path, jestConfig: Config.ProjectConfig | any, transformOptions?: TransformOptions): TransformedSource | string;`,
          }),
        }),
        pathFileInput: join(config.PATH.DIR.ROOT_NODE_MODULES, 'ts-jest/dist/ts-jest-transformer.d.ts'),
      },

      {
        onFile: ({ content }) => ({
          newContent: FilePatcher.utils.addWhenNotExist({
            content: FilePatcher.utils.addWhenNotExist({
              content,
              contentAdded: `export type BabelConfig = _babel.TransformOptions`,
            }),
            contentAdded: `import * as _babel from 'babel__core'`,
          }),
        }),
        pathFileInput: join(config.PATH.DIR.ROOT_NODE_MODULES, 'ts-jest/dist/types.d.ts'),
      },
    ],
  })
})()
