export declare const syncPackageDeps: ({ pathPackageSource, pathPackageSyncTo, }: {
    readonly pathPackageSource: string;
    readonly pathPackageSyncTo: string;
}) => Promise<{
    wroteFile: boolean;
}>;
