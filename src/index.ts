import { getBase as getBaseCommitlint } from './husky/base'
import { getBase as getBaseEslint } from './eslint/base'
import { getBase as getBaseHusky } from './commitlint/base'
import { getBase as getBaseJest } from './jest/base'
import { getBaseIntegration as getBaseIntegrationJest } from './jest/base-integration'
import { getBase as getBasePrettier } from './prettier/base'
import { getBase as getBaseStylelint } from './stylelint/base'
import { getBaseReact as getBaseEslintReact } from './eslint/base-react'

import { FilePatcher } from './utils/filePatcher'
import { syncPackageDeps } from './utils/syncPackageDeps'

export const commitlint = {
  getBase: getBaseCommitlint,
}
export const eslint = {
  getBase: getBaseEslint,
  getBaseReact: getBaseEslintReact,
}
export const husky = {
  getBase: getBaseHusky,
}

export const jest = {
  getBase: getBaseJest,
  getBaseIntegration: getBaseIntegrationJest,
}

export const prettier = {
  getBase: getBasePrettier,
}

export const stylelint = {
  getBase: getBaseStylelint,
}

export const utils = {
  FilePatcher,
  syncPackageDeps,
}
