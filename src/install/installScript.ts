import * as fs from 'fs-extra'

import { Install } from '.'
import { Configuration } from '../configuration'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  try {
    const packageJSONFromAppRoot = await fs.readJson(Install.PATH.FILE.ROOT_APP.packageJSON)

    if (Configuration.packageJSON.name === packageJSONFromAppRoot.name) {
      Install.utils.logger.info('Detected installation on own repo, exiting.')
      return
    }

    const { installFns } = Install

    await Promise.all(
      [
        installFns.commitlint,
        installFns.eslint,
        installFns.git,
        installFns.husky,
        installFns.jest,
        installFns.nvm,
        installFns.packageJSON as any,
        installFns.prettier,
        installFns.typescript,
        installFns.vscode,
      ].map(x => x())
    )
  } catch (err) {
    Install.utils.logger.error(err)
  }
})()
