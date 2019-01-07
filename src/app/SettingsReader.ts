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
 * @Last Modified At: 2019-01-07 01:15:11
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
import appversion, { CreateCommand } from 'appversion-mgr';

export class SettingsReader extends SettingsBase {

    constructor(rootPath: string, projectFile: string, private options: DotNetSettingsOptions) {

        super(rootPath, projectFile);
    }

    public init(overwriteSettingsFile?: boolean): Promise<ISettings[]> {

        return this.read(true, overwriteSettingsFile);
    }

    public read(createSettingsFile: boolean = false, overwriteSettingsFile: boolean = false): Promise<ISettings[]> {

        return new Promise<ISettings[]>(async (resolve, reject) => {
            try {

                if (this.IsSolution) {

                    const projects = await DotNetHelpers.getProjectsFromSolution(this.FilePath);
                    if (projects) {
                        const result = projects.map(async (projectFile: string) => {
                            const reader = new SettingsReader(this.RootPath, projectFile, this.options);
                            const projectSettings = await reader.read(createSettingsFile, overwriteSettingsFile);

                            if (projectSettings && projectSettings.length !== 0) {
                                return projectSettings[0];
                            }
                        });

                        Promise.all(result)
                            .then((results) => {
                                const settings = new Array<ISettings>();
                                results.map((resultItem) => {
                                    if (resultItem) {
                                        settings.push(resultItem);
                                    }
                                });
                                return settings;
                            })
                            .then((settings) => {
                                this.createSolutionFile(overwriteSettingsFile);
                                resolve(settings);
                            })
                            .catch((err) => reject(err));
                    } else {
                        Log.warning('No Projects found in Solution File.');
                    }

                } else {
                    const projectSettings = await this.loadProjectFile(createSettingsFile, overwriteSettingsFile);
                    if (projectSettings) {

                        resolve(new Array<ISettings>(projectSettings));
                    } else {
                        resolve(new Array<ISettings>());
                    }
                }
            } catch (e) {
                reject(Log.critical(e));
            }
        });
    }

    private parseProjectFile(project: ElementCompact, projectFile?: string): Promise<ISettings> {

        return new Promise<ISettings>(async (resolve, reject) => {
            if (!project.Project.PropertyGroup) {
                reject(Log.critical('No Property Group found.'));
            } else {

                const group = project.Project.PropertyGroup;
                const target = await DotNetHelpers.getDotNetCoreTarget();

                const settings: ISettings = {
                    ProjectFile: projectFile || null,
                    Build: {
                        AssemblyOriginatorKeyFile: this.readTextValue(group.AssemblyOriginatorKeyFile),
                        Configuration: this.readTextValue(group.Configuration, 'Release'),
                        DelaySign: this.readBoolValue(group.DelaySign, false),
                        OutputPath: this.readTextValue(group.OutputPath),
                        RuntimeIdentifiers: this.readTextValue(group.RuntimeIdentifiers),
                        SignAssembly: this.readBoolValue(group.SignAssembly, false),
                        TargetFramework: this.readTextValue(group.TargetFramework, target),
                    },
                    Package: {
                        Authors: this.readTextValue(group.Authors),
                        Company: this.readTextValue(group.Company),
                        Copyright: this.readTextValue(group.Copyright),
                        GeneratePackageOnBuild: this.readBoolValue(group.GeneratePackageOnBuild, false),
                        PackageProjectUrl: this.readTextValue(group.PackageProjectUrl),
                        RepositoryType: this.readTextValue(group.RepositoryType, 'git'),
                        RepositoryUrl: this.readTextValue(group.RepositoryUrl),
                    },
                    Project: {
                        Description: this.readTextValue(group.Description),
                        PackageTags: this.readTextValue(group.PackageTags),
                        RootNamespace: this.readTextValue(group.RootNamespace),
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

                if (this.options.UseAppVersionMgr && settings.Version) {
                    settings.Version.AssemblyVersion = await appversion.Info.composePattern('M.m.p.t', projectFile);
                    settings.Version.FileVersion = await appversion.Info.composePattern('M.m.p.t', projectFile);
                    settings.Version.InformationalVersion = await appversion.Info.composePattern('M.m.p-S.s-t', projectFile);
                    settings.Version.PackageVersion = await appversion.Info.composePattern('M.m.p-S.s-t', projectFile);
                    settings.Version.Version = await appversion.Info.composePattern('M.m.p', projectFile);
                    settings.Version.VersionPrefix = await appversion.Info.composePattern('M.m.p', projectFile);
                    settings.Version.VersionSuffix = await appversion.Info.composePattern('S.s-t', projectFile);
                }

                resolve(settings);
            }
        });
    }

    private readTextValue(value: any, defaultValue?: string): string | null {
        if (value) {
            return value._text;
        }

        if (defaultValue) {
            return defaultValue;
        }

        return null;
    }

    private readBoolValue(value: any, defaultValue: boolean): boolean {
        if (value) {
            return !!JSON.parse(String(value._text).toLowerCase());
        }

        return defaultValue;
    }

    private loadProjectFile(createSettingsFile: boolean, overwriteSettingsFile: boolean): Promise<ISettings> {

        return new Promise<ISettings>(async (resolve, reject) => {
            if (fs.existsSync(this.FilePath)) {
                try {
                    Log.info(`Load Project File '${this.FileName}' ...`);
                    const projectData = await fs.readFile(this.FilePath, { encoding: 'utf8' });

                    const project = xml2js(projectData, {
                        compact: true,
                        alwaysChildren: true,
                        ignoreComment: true,
                    });

                    let currentSettings = await this.parseProjectFile(project, this.FilePath);

                    const solutionSettingsFileName = this.getSettingsFileName(true);
                    const projectSettingsFileName = this.getSettingsFileName();

                    let solutionUserSettings: ISettings | null = null;
                    if (solutionSettingsFileName && fs.existsSync(solutionSettingsFileName)) {
                        Log.verbose('Load Solution User Settings');
                        solutionUserSettings = require(solutionSettingsFileName) as ISettings;
                    }

                    if (projectSettingsFileName && fs.existsSync(projectSettingsFileName)) {
                        Log.verbose('Load Project User Settings ...');
                        const projectUserSettings = require(projectSettingsFileName) as ISettings;

                        currentSettings = MergeHelpers.mergeSettings(currentSettings, projectUserSettings, solutionUserSettings);
                    }

                    if (currentSettings) {

                        if (createSettingsFile) {
                            const writer = new SettingsWriter(this.RootPath, this.FilePath, this.options);
                            currentSettings = await writer.writeSettings(currentSettings, overwriteSettingsFile);

                            if (this.options.UseAppVersionMgr) {
                                const dir = path.dirname(this.FilePath);
                                const create = new CreateCommand(dir);
                                create.initAppVersion();
                            }
                        }

                        resolve(currentSettings);
                    } else {
                        Log.warning(`Project File '${this.FileName}' could not readed.`);
                        resolve();
                    }
                } catch (e) {
                    reject(Log.critical(e));
                }
            } else {
                Log.warning(`Project File '${this.FileName}' not exists.`);
                resolve();
            }
        });
    }

    private createSolutionFile(overwriteSettingsFile: boolean): Promise<any> {

        return new Promise(async (resolve, reject) => {
            if (overwriteSettingsFile) {
                const emptyProject = `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup></PropertyGroup></Project>`;

                const project = xml2js(emptyProject, {
                    compact: true,
                    alwaysChildren: true,
                    ignoreComment: true,
                });

                const currentSettings = await this.parseProjectFile(project);
                if (currentSettings) {
                    const writer = new SettingsWriter(this.RootPath, this.FilePath, this.options);
                    writer.writeSettings(currentSettings, overwriteSettingsFile);
                }
            }
        });
    }
}
