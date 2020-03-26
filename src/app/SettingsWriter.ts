/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: SettingsWriter.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 17:00:16
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2020-02-19 07:49:43
 * @Description: This is description.
 */

import path from 'path';
import fs from 'fs-extra';
import { xml2js, xml2json, js2xml, json2xml, Element, ElementCompact } from 'xml-js';
import { ISettings, DotNetSettingsOptions } from '../types';
import { SettingsBase } from './SettingsBase';
import { Log } from '../helpers/Log';
import { Helper } from '../helpers/Helper';
import { UpdateCommand } from 'appversion-mgr';

export class SettingsWriter extends SettingsBase {

    constructor(solutionFile: string, projectFile: string, private options: DotNetSettingsOptions) {

        super(solutionFile, projectFile);
    }
    public async writeSettings(settings: ISettings, overwrite?: boolean): Promise<ISettings> {

        try {
            const settingsFileName = this.getSettingsFileName(this.IsSolution);
            if (settingsFileName && (overwrite || !fs.existsSync(settingsFileName))) {
                Log.verbose('Create Settings File ...');
                if (this.IsSolution) {
                    delete settings.Project;
                    delete settings.ProjectFile;
                } else {
                    delete settings.Package;
                    delete settings.Build;
                    delete settings.Version;
                    delete settings.Pattern;
                }

                await fs.writeJson(settingsFileName, settings, {
                    encoding: 'utf-8',
                    spaces: 4,
                });
            } else {
                Log.warning('Settings File already exists.');
            }
            return settings;
        } catch (e) {
            throw e;
        }
    }

    public async updateProject(setting: ISettings): Promise<any> {

        const root = Helper.getRoot();

        if (setting.ProjectFile) {
            const file = path.join(root, setting.ProjectFile);
            const projectData = await fs.readFile(file, { encoding: 'utf-8' });

            let project = xml2js(projectData, {
                compact: true,
                alwaysChildren: true,
                ignoreComment: true,
            }) as ElementCompact;

            let group = this.searchGroup(project);
            if (setting.Build) {
                group = this.writeTextValue(group, 'AssemblyOriginatorKeyFile', setting.Build.AssemblyOriginatorKeyFile);
                group = this.writeTextValue(group, 'Configuration', setting.Build.Configuration);
                group = this.writeBoolValue(group, 'DelaySign', setting.Build.DelaySign);
                group = this.writeTextValue(group, 'OutputPath', setting.Build.OutputPath);
                group = this.writeTextValue(group, 'RuntimeIdentifiers', setting.Build.RuntimeIdentifiers);
                group = this.writeBoolValue(group, 'SignAssembly', setting.Build.SignAssembly);

                if (setting.Build.TargetFramework && setting.Build.TargetFramework.indexOf(';') > -1) {
                    group = this.writeTextValue(group, 'TargetFramework', null);
                    group = this.writeTextValue(group, 'TargetFrameworks', setting.Build.TargetFramework);
                } else {
                    group = this.writeTextValue(group, 'TargetFrameworks', null);
                    group = this.writeTextValue(group, 'TargetFramework', setting.Build.TargetFramework);
                }
                group = this.writeBoolValue(group, 'GenerateDocumentationFile', setting.Build.GenerateDocumentationFile);
            }

            if (setting.Package) {
                group = this.writeTextValue(group, 'Authors', setting.Package.Authors);
                group = this.writeTextValue(group, 'Company', setting.Package.Company);
                group = this.writeTextValue(group, 'Copyright', setting.Package.Copyright);
                group = this.writeBoolValue(group, 'GeneratePackageOnBuild', setting.Package.GeneratePackageOnBuild);
                group = this.writeTextValue(group, 'PackageProjectUrl', setting.Package.PackageProjectUrl);
                group = this.writeTextValue(group, 'RepositoryType', setting.Package.RepositoryType);
                group = this.writeTextValue(group, 'RepositoryUrl', setting.Package.RepositoryUrl);
            }

            if (setting.Project) {
                group = this.writeTextValue(group, 'AssemblyName', setting.Project.AssemblyName);
                group = this.writeTextValue(group, 'Description', setting.Project.Description);
                group = this.writeTextValue(group, 'PackageTags', setting.Project.PackageTags);
                group = this.writeTextValue(group, 'RootNamespace', setting.Project.RootNamespace);
                group = this.writeTextValue(group, 'LangVersion', setting.Project.LangVersion);
                group = this.writeBoolValue(group, 'IsTestProject', setting.Project.IsTestProject);
                if (setting.Build.GenerateDocumentationFile) {
                    if (setting.Project.AssemblyName) {
                        let outputPath = setting.Build.OutputPath;
                        if (!outputPath) {
                            outputPath = '';
                        }
                        let docuFile = path.join(outputPath, setting.Project.AssemblyName);
                        docuFile = `${docuFile}.xml`;
                        group = this.writeTextValue(group, 'DocumentationFile', docuFile);
                    } else {
                        group = this.writeTextValue(group, 'DocumentationFile', null);
                    }
                } else {
                    group = this.writeTextValue(group, 'DocumentationFile', null);
                }
            }

            if (setting.Version) {
                group = this.writeTextValue(group, 'AssemblyVersion', setting.Version.AssemblyVersion);
                group = this.writeTextValue(group, 'FileVersion', setting.Version.FileVersion);
                group = this.writeTextValue(group, 'InformationalVersion', setting.Version.InformationalVersion);
                group = this.writeTextValue(group, 'PackageVersion', setting.Version.PackageVersion);
                group = this.writeTextValue(group, 'Version', setting.Version.Version);
                group = this.writeTextValue(group, 'VersionPrefix', setting.Version.VersionPrefix);
                group = this.writeTextValue(group, 'VersionSuffix', setting.Version.VersionSuffix);
            }

            project = this.replaceGroup(project, group);
            const projectAsXml = js2xml(project, {
                compact: true,
                ignoreComment: true,
                spaces: 8,
            });

            await fs.writeFile(file, projectAsXml, { encoding: 'utf-8' });

            if (this.options.UseAppVersionMgr) {

                let badgeUrl = null;
                let projectUrl = null;
                let projectName = null;
                if (setting.Package) {
                    badgeUrl = setting.Package.BadgeBaseUrl;
                    projectUrl = setting.Package.PackageProjectUrl;
                }
                if (setting.Project) {
                    projectName = setting.Project.AssemblyName;
                }

                const update = new UpdateCommand(path.dirname(file));
                update.updateBadges(badgeUrl || undefined, projectUrl || undefined, projectName || undefined);
            }
        }
    }
}
