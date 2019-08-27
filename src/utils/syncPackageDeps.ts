import { readJSON, writeFile } from 'fs-extra'
import { EOL } from 'os'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dependency, JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package'

export const syncPackageDeps = async ({
  pathPackageSource,
  pathPackageSyncTo,
}: {
  readonly pathPackageSource: string
  readonly pathPackageSyncTo: string
}) => {
  const [packageSource, packageSyncTo] = await Promise.all([
    readJSON(pathPackageSource) as Promise<JSONSchemaForNPMPackageJsonFiles>,
    readJSON(pathPackageSyncTo) as Promise<JSONSchemaForNPMPackageJsonFiles>,
  ])

  if (packageSource.dependencies && packageSyncTo.dependencies) {
    const newDependencies: Dependency = {
      ...packageSyncTo.dependencies,
    }

    Object.keys(packageSyncTo.dependencies).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const versionPJSON = packageSource.dependencies![k]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const versionPJSONSync = packageSyncTo.dependencies![k]

      if (versionPJSON && versionPJSONSync && versionPJSON !== versionPJSONSync) {
        newDependencies[k] = versionPJSON
      }
    })

    if (JSON.stringify(packageSyncTo.dependencies) !== JSON.stringify(newDependencies)) {
      await writeFile(
        pathPackageSyncTo,
        JSON.stringify(
          {
            ...packageSyncTo,
            dependencies: newDependencies,
          },
          undefined,
          2
        ) + EOL
      )

      return { wroteFile: true }
    }
  }

  return { wroteFile: false }
}
