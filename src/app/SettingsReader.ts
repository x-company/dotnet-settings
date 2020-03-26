/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: SettingsReader.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 17:00:16
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2020-02-19 10:20:48
 * @Description: This is description.
 */

import fs from 'fs-extra';
import path from 'path';
import { xml2js, ElementCompact } from 'xml-js';
import { ISettings, DotNetSettingsOptions } from '../types';
import { Log } from '../helpers/Log';
import { DotNetHelpers } from '../helpers/DotNetHelpers';
import { SettingsBase } from './SettingsBase';
import { SettingsWriter } from './SettingsWriter';
import { MergeHelpers } from '../helpers/MergeHelpers';
import { Info, CreateCommand } from 'appversion-mgr';
import { Helper } from '../helpers/Helper';

export class SettingsReader extends SettingsBase {

    constructor(private options: DotNetSettingsOptions, solutionFile: string, projectFile?: string) {

        super(solutionFile, projectFile);
    }

    public init(overwriteSettingsFile?: boolean): Promise<ISettings> {

        return this.read(true, overwriteSettingsFile);
    }

    public async read(createSettingsFile: boolean = false, overwriteSettingsFile: boolean = false): Promise<ISettings> {

        try {
            if (this.IsSolution) {
                Log.success(`Process Solution '${this.SolutionFileName}' ...`);
            } else {
                Log.success(`Process Project '${this.ProjectFileName}' ...`);
            }
            const projectSettings = await this.loadProjectFile(createSettingsFile, overwriteSettingsFile);

            return projectSettings;

        } catch (e) {
            throw e;
        }
    }

    public async upgradeSchema() {
        try {
            const settingsFileName = this.getSettingsFileName(this.IsSolution);
            if (settingsFileName) {
                Log.info('Verify Schema Upgrade for Settings File ...');
                const currentSettings = await fs.readJson(settingsFileName, { encoding: 'utf-8' }) as ISettings;
                const defaultSettings = await this.initSettings();
                let upgradedSettings = {};

                if (this.IsSolution) {
                    delete defaultSettings.Project;
                    delete defaultSettings.ProjectFile;

                    upgradedSettings = {
                        ...defaultSettings,
                        ...currentSettings,
                        Package: {
                            ...defaultSettings.Package,
                            ...currentSettings.Package,
                        },
                        Build: {
                            ...defaultSettings.Build,
                            ...currentSettings.Build,
                        },
                        Version: {
                            ...defaultSettings.Version,
                            ...currentSettings.Version,
                        },
                        Pattern: {
                            ...defaultSettings.Pattern,
                            ...currentSettings.Pattern,
                        },
                    };
                } else {
                    delete defaultSettings.Package;
                    delete defaultSettings.Build;
                    delete defaultSettings.Version;
                    delete defaultSettings.Pattern;

                    upgradedSettings = {
                        ...defaultSettings,
                        ...currentSettings,
                        Project: {
                            ...defaultSettings.Project,
                            ...currentSettings.Project,
                        }
                    };
                }

                await fs.writeJson(settingsFileName, upgradedSettings, {
                    encoding: 'utf-8',
                    spaces: 4,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    private async parseProjectFile(project: ElementCompact): Promise<ISettings> {

        // Init Blank Settings
        const blankSettings = await this.initSettings();

        if (this.IsSolution || !project.Project.PropertyGroup) {
            return blankSettings;
        } else {

            const target = await this.searchDotNetTarget();

            const rootDir = Helper.getRoot();
            let cleanedProjectFile = this.ProjectFilePath;
            let assemblyName = '';
            if (cleanedProjectFile) {
                cleanedProjectFile = cleanedProjectFile.replace(rootDir, '');
                if (cleanedProjectFile.startsWith('/')) {
                    cleanedProjectFile = cleanedProjectFile.substring(1);
                }
                assemblyName = path.basename(cleanedProjectFile);
                assemblyName = assemblyName.replace('.csproj', '');
            }
            const isTestProject = assemblyName.indexOf('Tests') > -1;

            const group = this.searchGroup(project);
            const settings: ISettings = {
                ...blankSettings,
                ProjectFile: cleanedProjectFile || '',
                Build: {
                    AssemblyOriginatorKeyFile: this.readTextValue(group.AssemblyOriginatorKeyFile),
                    Configuration: this.readTextValue(group.Configuration, 'Release'),
                    DelaySign: this.readBoolValue(group.DelaySign, false),
                    OutputPath: this.readTextValue(group.OutputPath),
                    RuntimeIdentifiers: this.readTextValue(group.RuntimeIdentifiers),
                    SignAssembly: this.readBoolValue(group.SignAssembly, false),
                    TargetFramework: this.readTextValue(group.TargetFramework, target),
                    GenerateDocumentationFile: this.readBoolValue(group.GenerateDocumentationFile, false),
                },
                Package: {
                    Authors: this.readTextValue(group.Authors),
                    Company: this.readTextValue(group.Company),
                    Copyright: this.readTextValue(group.Copyright),
                    GeneratePackageOnBuild: this.readBoolValue(group.GeneratePackageOnBuild, false),
                    PackageProjectUrl: this.readTextValue(group.PackageProjectUrl),
                    RepositoryType: this.readTextValue(group.RepositoryType),
                    RepositoryUrl: this.readTextValue(group.RepositoryUrl),
                    BadgeBaseUrl: null,
                },
                Project: {
                    Description: this.readTextValue(group.Description),
                    PackageTags: this.readTextValue(group.PackageTags),
                    RootNamespace: this.readTextValue(group.RootNamespace),
                    AssemblyName: this.readTextValue(group.AssemblyName, assemblyName),
                    IsTestProject: this.readBoolValue(group.IsTestProject, isTestProject),
                    LangVersion: this.readTextValue(group.LangVersion, '8.0'),
                },
                Version: {
                    AssemblyVersion: this.readTextValue(group.AssemblyVersion, '0.1.0.0'),
                    FileVersion: this.readTextValue(group.FileVersion, '0.1.0.0'),
                    InformationalVersion: this.readTextValue(group.InformationalVersion, '0.1.0'),
                    PackageVersion: this.readTextValue(group.PackageVersion, '0.1.0'),
                    Version: this.readTextValue(group.Version, '0.1.0'),
                    VersionPrefix: this.readTextValue(group.VersionPrefix, '0.1.0'),
                    VersionSuffix: this.readTextValue(group.VersionSuffix),
                },
            };
            return settings;
        }
    }

    private async initSettings(): Promise<ISettings> {

        const target = await this.searchDotNetTarget();

        return {
            ProjectFile: '',
            Build: {
                AssemblyOriginatorKeyFile: null,
                Configuration: 'Release',
                DelaySign: false,
                OutputPath: null,
                RuntimeIdentifiers: null,
                SignAssembly: false,
                TargetFramework: target,
                GenerateDocumentationFile: false,
            },
            Package: {
                Authors: null,
                Company: null,
                Copyright: null,
                GeneratePackageOnBuild: false,
                PackageProjectUrl: null,
                RepositoryType: null,
                RepositoryUrl: null,
                BadgeBaseUrl: null,
            },
            Project: {
                Description: null,
                PackageTags: null,
                RootNamespace: null,
                AssemblyName: null,
                IsTestProject: false,
                LangVersion: '8.0',
            },
            Version: {
                AssemblyVersion: '0.1.0.0',
                FileVersion: '0.1.0.0',
                InformationalVersion: '0.1.0',
                PackageVersion: '0.1.0',
                Version: '0.1.0',
                VersionPrefix: '0.1.0',
                VersionSuffix: null,
            },
            Pattern: {
                AssemblyVersion: 'M.m.p.t',
                FileVersion: 'M.m.p.t',
                InformationalVersion: 'M.m.p-S.s-t',
                PackageVersion: 'M.m.p-S.s-t',
                Version: 'M.m.p',
                VersionPrefix: 'M.m.p',
                VersionSuffix: 'S.s-t',
            },
        };
    }

    private async loadProjectFile(createSettingsFile: boolean, overwriteSettingsFile: boolean): Promise<ISettings> {

        try {

            let currentSettings = await this.initSettings();
            if (!this.IsSolution) {
                Log.info(`Load Project File '${this.ProjectFileName}' ...`);
                const projectData = await fs.readFile(this.ProjectFilePath, { encoding: 'utf8' });

                const project = xml2js(projectData, {
                    compact: true,
                    alwaysChildren: true,
                    ignoreComment: true,
                });

                currentSettings = await this.parseProjectFile(project);
            }

            let solutionUserSettings = null;
            const solutionSettingsFileName = this.getSettingsFileName(true);
            if (solutionSettingsFileName && fs.existsSync(solutionSettingsFileName)) {
                Log.verbose('Load Solution User Settings');
                solutionUserSettings = require(solutionSettingsFileName) as ISettings;
            }

            const projectSettingsFileName = this.getSettingsFileName();
            if (projectSettingsFileName && fs.existsSync(projectSettingsFileName)) {
                Log.verbose('Load Project User Settings ...');
                const projectUserSettings = require(projectSettingsFileName) as ISettings;

                let useAppvMgr = false;
                if (this.options.UseAppVersionMgr) {
                    useAppvMgr = this.options.UseAppVersionMgr;
                }
                currentSettings = MergeHelpers.mergeSettings(currentSettings, projectUserSettings, solutionUserSettings, useAppvMgr);
            }

            if (currentSettings) {

                if (this.options.UseAppVersionMgr && currentSettings.Version && !this.IsSolution) {

                    const dir = path.dirname(this.ProjectFilePath);
                    const patterns = currentSettings.Pattern;

                    currentSettings.Version.AssemblyVersion = await Info.composePattern(patterns.AssemblyVersion, dir);
                    currentSettings.Version.FileVersion = await Info.composePattern(patterns.FileVersion, dir);
                    currentSettings.Version.InformationalVersion = await Info.composePattern(patterns.InformationalVersion, dir);
                    currentSettings.Version.PackageVersion = await Info.composePattern(patterns.PackageVersion, dir);
                    currentSettings.Version.Version = await Info.composePattern(patterns.Version, dir);
                    currentSettings.Version.VersionPrefix = await Info.composePattern(patterns.VersionPrefix, dir);
                    currentSettings.Version.VersionSuffix = await Info.composePattern(patterns.VersionSuffix, dir);
                }

                if (createSettingsFile) {
                    const writer = new SettingsWriter(this.SolutionFilePath, this.ProjectFilePath, this.options);
                    currentSettings = await writer.writeSettings(currentSettings, overwriteSettingsFile);

                    const dir = path.dirname(this.ProjectFilePath);
                    const appVersionFile = path.join(dir, 'appversion.json');

                    if (this.options.UseAppVersionMgr && !this.IsSolution && (overwriteSettingsFile || !fs.existsSync(appVersionFile))) {

                        if (fs.existsSync(appVersionFile)) {
                            fs.unlinkSync(appVersionFile);
                        }

                        let badgeUrl = null;
                        let projectUrl = null;
                        let projectName = null;
                        if (currentSettings.Package) {
                            badgeUrl = currentSettings.Package.BadgeBaseUrl;
                            projectUrl = currentSettings.Package.PackageProjectUrl;
                        }
                        if (currentSettings.Project) {
                            projectName = currentSettings.Project.AssemblyName;
                        }

                        const create = new CreateCommand(dir, badgeUrl || undefined, projectUrl || undefined, projectName || undefined);
                        create.initAppVersion();
                    }
                }
            }

            return currentSettings;
        } catch (e) {
            throw e;
        }
    }
}
