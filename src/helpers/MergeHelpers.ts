import { IVersionPatternSettings } from './../types/IVersionPatternSettings';
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
 * @Last Modified At: 2020-03-08 20:09:49
 * @Description: This is description.
 */

import { ISettings, IBuildSettings, IPackageSettings, IProjectSettings, IVersionSettings } from '../types';
import { isNull } from 'util';

export class MergeHelpers {

    public static mergeSettings(current: ISettings, project: ISettings, solution: any, useAppVersionMgr: boolean): ISettings {

        if (current && project && solution) {
            if (current.Build) {
                current.Build = this.mergeBuildSettings(current.Build, project.Build, solution.Build);
            }
            if (current.Package) {
                current.Package = this.mergePackageSettings(current.Package, project.Package, solution.Package);
            }
            if (current.Project) {
                current.Project = this.mergeProjectSettings(current.Project, project.Project, solution.Project);
            }
            if (current.Version) {
                current.Version = this.mergeVersionSettings(current.Version, project.Version, solution.Version, useAppVersionMgr);
            }
            if (current.Pattern) {
                current.Pattern = this.mergePatternSettings(current.Pattern, project.Pattern, solution.Pattern);
            }
        }

        return current;
    }

    private static mergeBuildSettings(current: IBuildSettings, project: IBuildSettings, solution: IBuildSettings): IBuildSettings {

        const result = {
            AssemblyOriginatorKeyFile: (project && project.AssemblyOriginatorKeyFile) || (solution && solution.AssemblyOriginatorKeyFile) || current.AssemblyOriginatorKeyFile,
            TargetFramework: (project && project.TargetFramework) || (solution && solution.TargetFramework) || current.TargetFramework,
            RuntimeIdentifiers: (project && project.RuntimeIdentifiers) || (solution && solution.RuntimeIdentifiers) || current.RuntimeIdentifiers,
            Configuration: (project && project.Configuration) || (solution && solution.Configuration) || current.Configuration,
            OutputPath: (project && project.OutputPath) || (solution && solution.OutputPath) || current.OutputPath,

            // Boolean Values will not used from Visual Studio Project File
            SignAssembly: this.mergeBoolValues((project && project.SignAssembly), (solution && solution.SignAssembly)),
            DelaySign: this.mergeBoolValues((project && project.DelaySign), (solution && solution.DelaySign)),
            GenerateDocumentationFile: this.mergeBoolValues((project && project.GenerateDocumentationFile), (solution && solution.GenerateDocumentationFile)),
        };

        return result;
    }

    private static mergePackageSettings(current: IPackageSettings, project: IPackageSettings, solution: IPackageSettings): IPackageSettings {

        const result = {
            Authors: (project && project.Authors) || (solution && solution.Authors) || current.Authors,
            Company: (project && project.Company) || (solution && solution.Company) || current.Company,
            Copyright: (project && project.Copyright) || (solution && solution.Copyright) || current.Copyright,
            PackageProjectUrl: (project && project.PackageProjectUrl) || (solution && solution.PackageProjectUrl) || current.PackageProjectUrl,
            RepositoryUrl: (project && project.RepositoryUrl) || (solution && solution.RepositoryUrl) || current.RepositoryUrl,
            RepositoryType: (project && project.RepositoryType) || (solution && solution.RepositoryType) || current.RepositoryType,
            BadgeBaseUrl: (project && project.BadgeBaseUrl) || (solution && solution.BadgeBaseUrl),

            // Boolean Values will not used from Visual Studio Project File
            GeneratePackageOnBuild: this.mergeBoolValues((project && project.GeneratePackageOnBuild), (solution && solution.GeneratePackageOnBuild)),
        };

        return result;
    }

    private static mergeProjectSettings(current: IProjectSettings, project: IProjectSettings, solution: IProjectSettings): IProjectSettings {

        const result = {
            RootNamespace: (project && project.RootNamespace) || (solution && solution.RootNamespace) || current.RootNamespace,
            Description: (project && project.Description) || (solution && solution.Description) || current.Description,
            PackageTags: (project && project.PackageTags) || (solution && solution.PackageTags) || current.PackageTags,
            AssemblyName: (project && project.AssemblyName) || (solution && solution.AssemblyName) || current.AssemblyName,
            LangVersion: (project && project.LangVersion) || (solution && solution.LangVersion) || current.LangVersion,

            // Boolean Values will not used from Visual Studio Project File
            IsTestProject: this.mergeBoolValues((project && project.IsTestProject), (solution && solution.IsTestProject)),
        };

        return result;
    }

    private static mergeVersionSettings(current: IVersionSettings, project: IVersionSettings, solution: IVersionSettings, useAppVersionMgr: boolean): IVersionSettings {

        if (useAppVersionMgr) {
            return current;
        } else {
            return {
                Version: (project && project.Version) || (solution && solution.Version) || current.Version,
                VersionPrefix: (project && project.VersionPrefix) || (solution && solution.VersionPrefix) || current.VersionPrefix,
                VersionSuffix: (project && project.VersionSuffix) || (solution && solution.VersionSuffix) || current.VersionSuffix,
                FileVersion: (project && project.FileVersion) || (solution && solution.FileVersion) || current.FileVersion,
                PackageVersion: (project && project.PackageVersion) || (solution && solution.PackageVersion) || current.PackageVersion,
                AssemblyVersion: (project && project.AssemblyVersion) || (solution && solution.AssemblyVersion) || current.AssemblyVersion,
                InformationalVersion: (project && project.InformationalVersion) || (solution && solution.InformationalVersion) || current.InformationalVersion,
            };
        }
    }

    private static mergePatternSettings(current: IVersionPatternSettings, project: IVersionPatternSettings, solution: IVersionPatternSettings): IVersionPatternSettings {

        return {
            Version: (project && project.Version) || (solution && solution.Version) || current.Version,
            VersionPrefix: (project && project.VersionPrefix) || (solution && solution.VersionPrefix) || current.VersionPrefix,
            VersionSuffix: (project && project.VersionSuffix) || (solution && solution.VersionSuffix) || current.VersionSuffix,
            FileVersion: (project && project.FileVersion) || (solution && solution.FileVersion) || current.FileVersion,
            PackageVersion: (project && project.PackageVersion) || (solution && solution.PackageVersion) || current.PackageVersion,
            AssemblyVersion: (project && project.AssemblyVersion) || (solution && solution.AssemblyVersion) || current.AssemblyVersion,
            InformationalVersion: (project && project.InformationalVersion) || (solution && solution.InformationalVersion) || current.InformationalVersion,
        };
    }

    private static mergeBoolValues(projectValue: boolean | null, solutionValue: boolean | null): boolean {

        if (projectValue !== undefined && projectValue !== null) {
            return projectValue;
        } else if (solutionValue !== undefined && solutionValue !== null) {
            return solutionValue;
        } else {
            return false;
        }
    }
}
