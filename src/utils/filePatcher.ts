import * as fsExtra from 'fs-extra'
import * as path from 'path'
import { EOL } from 'os'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { logger } = require('just-task')

export type TPatchFileOnFile = (x: {
  readonly content: Buffer
}) => { readonly newContent: string | Buffer } | Promise<{ readonly newContent: string | Buffer }> | void

export interface IPatchFileOptions {
  readonly onFile: TPatchFileOnFile
  readonly pathFileInput: string
  readonly pathFileOutput?: string
}

export class FilePatcher {
  public static constants = {
    EOL,
  }

  public static utils = {
    fsExtra,
    logger,
    path,

    patchStringContent({
      content,
      stringMatch,
      stringReplace,
    }: {
      readonly content: string | Buffer
      readonly stringMatch: string
      readonly stringReplace: string
    }) {
      const contentStr = content instanceof Buffer ? content.toString() : content

      return contentStr.indexOf(stringMatch) === -1 ? contentStr : contentStr.replace(stringMatch, stringReplace)
    },
  }

  public logPrefix: string

  public constructor({ logPrefix }: { readonly logPrefix: string }) {
    this.logPrefix = logPrefix
  }

  public patchFile = async ({ onFile, pathFileInput, pathFileOutput }: IPatchFileOptions) => {
    const content = await fsExtra.readFile(pathFileInput)
    const pathFileWrite = pathFileOutput || pathFileInput

    const returned = await onFile({ content })

    if (returned && returned.newContent) {
      const contentStr = content.toString()
      const contentStrReturned =
        returned.newContent instanceof Buffer ? returned.newContent.toString() : returned.newContent

      if (contentStr !== contentStrReturned) {
        await fsExtra.writeFile(pathFileWrite, returned.newContent)

        logger.info(`"${this.logPrefix}" - wrote file "${pathFileWrite}" successfully.`)

        return {
          wroteFile: true,
        }
      }

      logger.warn(`"${this.logPrefix}" - Content was not changed, not writing to "${pathFileWrite}".`)
    } else {
      logger.warn(`"${this.logPrefix}" - Nothing returned from onFile callback.`)
    }

    return {
      wroteFile: false,
    }
  }

  public patchFiles = ({ patchList }: { readonly patchList: IPatchFileOptions[] }) =>
    Promise.all(patchList.map(x => this.patchFile(x)))
}
