import { getBase as getBaseEslint } from './eslint/base'
import { getBase as getBaseJest } from './jest/base'
import { getBaseIntegration as getBaseIntegrationJest } from './jest/base-integration'
import { getBase as getBasePrettier } from './prettier/base'
import { getBase as getBaseStylelint } from './stylelint/base'

import { FilePatcher } from './utils/filePatcher'
import { syncPackageDeps } from './utils/syncPackageDeps'

export const eslint = {
  getBase: getBaseEslint,
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
