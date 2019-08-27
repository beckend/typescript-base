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
    const typescriptBaseRC = await Install.getters.typescriptBaseRC()

    await Promise.all(
      [
        installFns.editorconfig,
        installFns.eslint,
        installFns.git,
        installFns.husky,
        installFns.jest,
        installFns.nvm,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        installFns.packageJSON as any,
        installFns.prettier,
        installFns.typescript,
        installFns.vscode,
      ].map((x) => x({ typescriptBaseRC }))
    )
  } catch (err) {
    Install.utils.logger.error(err)
  }
})()
