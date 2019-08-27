import { FilePatcher } from '../utils/filePatcher'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const filePatcher = new FilePatcher({ logPrefix: __filename })

  await filePatcher.patchFiles({
    patchList: [],
  })
})()
