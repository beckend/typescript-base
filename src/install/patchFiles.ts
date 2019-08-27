import { FilePatcher } from '../utils/filePatcher'
import config from '../config'

const { join } = FilePatcher.utils.path

  // broken typings and PR not merged
;(async () => {
  const filePatcher = new FilePatcher({ logPrefix: __filename })

  await filePatcher.patchFiles({
    patchList: [
      {
        onFile: ({ content }) => ({
          newContent: FilePatcher.utils.patchStringContent({
            content,
            stringMatch: `import _ts, { CompilerOptions, SourceFile, TransformerFactory } from 'typescript';`,
            stringReplace: `import { CompilerOptions, SourceFile, TransformerFactory } from 'typescript';${FilePatcher.constants.EOL}import * as _ts from 'typescript';`,
          }),
        }),
        pathFileInput: join(config.PATH.DIR.ROOT_NODE_MODULES, 'ts-jest/dist/types.d.ts'),
      },
    ],
  })
})()
