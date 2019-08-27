import { EOL } from 'os'
import { logger } from 'just-task'
import * as fsExtra from 'fs-extra'
import * as path from 'path'

export type TPatchFileOnFile = (x: {
  readonly content: Buffer
}) => { readonly newContent: string | Buffer } | Promise<{ readonly newContent: string | Buffer }> | void

export interface IPatchFileOptions {
  readonly onFile: TPatchFileOnFile
  readonly pathFileInput: string
  readonly pathFileOutput?: string
}

export class FilePatcher {
  static constants = {
    EOL,
  }

  static utils = {
    fsExtra,
    logger,
    path,

    addWhenNotExist({
      addEOL = true,
      content,
      contentAdded,
    }: {
      readonly addEOL?: boolean
      readonly contentAdded: string
      readonly content: string | Buffer
    }) {
      const contentStr = FilePatcher.utils.getString({ content })

      if (contentStr.indexOf(contentAdded) === -1) {
        return contentAdded + (addEOL ? EOL : '') + contentStr
      }

      return contentStr
    },

    getString({ content }: { readonly content: string | Buffer }) {
      return content instanceof Buffer ? content.toString() : content
    },

    patchStringContent({
      content,
      stringMatch,
      stringReplace,
    }: {
      readonly content: string | Buffer
      readonly stringMatch: string
      readonly stringReplace: string
    }) {
      const contentStr = FilePatcher.utils.getString({ content })

      return contentStr.indexOf(stringMatch) === -1 ? contentStr : contentStr.replace(stringMatch, stringReplace)
    },
  }

  logPrefix: string

  constructor({ logPrefix }: { readonly logPrefix: string }) {
    this.logPrefix = logPrefix
  }

  patchFile = async ({ onFile, pathFileInput, pathFileOutput }: IPatchFileOptions) => {
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

  patchFiles = ({ patchList }: { readonly patchList: IPatchFileOptions[] }) =>
    Promise.all(patchList.map((x) => this.patchFile(x)))
}
