/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: MergeHelpers.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-06 19:22:40
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-07 00:08:33
 * @Description: This is description.
 */

import { ISettings, IBuildSettings, IPackageSettings, IProjectSettings, IVersionSettings } from '../types';

export class MergeHelpers {

    public static mergeSettings(current: ISettings, project: ISettings | null, solution: ISettings | null): ISettings {

        if (current && project && solution) {
            current.Build = this.mergeBuildSettings(current.Build, project.Build, solution.Build);
            current.Package = this.mergePackageSettings(current.Package, project.Package, solution.Package);
            current.Project = this.mergeProjectSettings(current.Project, project.Project, solution.Project);
            current.Version = this.mergeVersionSettings(current.Version, project.Version, solution.Version);
        }

        return current;
    }

    private static mergeBuildSettings(current: IBuildSettings | null, project: IBuildSettings | null, solution: IBuildSettings | null): IBuildSettings | null {

        if (current && project && solution) {
            current = {
                AssemblyOriginatorKeyFile: solution.AssemblyOriginatorKeyFile || project.AssemblyOriginatorKeyFile || current.AssemblyOriginatorKeyFile,
                TargetFramework: solution.TargetFramework || project.TargetFramework || current.TargetFramework,
                RuntimeIdentifiers: solution.RuntimeIdentifiers || project.RuntimeIdentifiers || current.RuntimeIdentifiers,
                Configuration: solution.Configuration || project.Configuration || current.Configuration,
                SignAssembly: solution.SignAssembly || project.SignAssembly || current.SignAssembly,
                DelaySign: solution.DelaySign || project.DelaySign || current.DelaySign,
                OutputPath: solution.OutputPath || project.OutputPath || current.OutputPath,
            };
        }

        return current;
    }

    private static mergePackageSettings(current: IPackageSettings | null, project: IPackageSettings | null, solution: IPackageSettings | null): IPackageSettings | null {

        if (current && project && solution) {
            current = {
                Authors: solution.Authors || project.Authors || current.Authors,
                Company: solution.Company || project.Company || current.Company,
                Copyright: solution.Copyright || project.Copyright || current.Copyright,
                PackageProjectUrl: solution.PackageProjectUrl || project.PackageProjectUrl || current.PackageProjectUrl,
                RepositoryUrl: solution.RepositoryUrl || project.RepositoryUrl || current.RepositoryUrl,
                RepositoryType: solution.RepositoryType || project.RepositoryType || current.RepositoryType,
                GeneratePackageOnBuild: solution.GeneratePackageOnBuild || project.GeneratePackageOnBuild || current.GeneratePackageOnBuild,
            };
        }
        return current;
    }

    private static mergeProjectSettings(current: IProjectSettings | null, project: IProjectSettings | null, solution: IProjectSettings | null): IProjectSettings | null {

        if (current && project && solution) {

            current = {
                RootNamespace: solution.RootNamespace || project.RootNamespace || current.RootNamespace,
                Description: solution.Description || project.Description || current.Description,
                PackageTags: solution.PackageTags || project.PackageTags || current.PackageTags,
            };
        }

        return current;
    }

    private static mergeVersionSettings(current: IVersionSettings | null, project: IVersionSettings | null, solution: IVersionSettings | null): IVersionSettings | null {

        if (current && project && solution) {

            current = {
                Version: solution.Version || project.Version || current.Version,
                VersionPrefix: solution.VersionPrefix || project.VersionPrefix || current.VersionPrefix,
                VersionSuffix: solution.VersionSuffix || project.VersionSuffix || current.VersionSuffix,
                FileVersion: solution.FileVersion || project.FileVersion || current.FileVersion,
                PackageVersion: solution.PackageVersion || project.PackageVersion || current.PackageVersion,
                AssemblyVersion: solution.AssemblyVersion || project.AssemblyVersion || current.AssemblyVersion,
                InformationalVersion: solution.InformationalVersion || project.InformationalVersion || current.InformationalVersion,
            };
        }
        return current;
    }
}
