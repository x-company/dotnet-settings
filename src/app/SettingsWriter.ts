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
 * @Last Modified At: 2019-01-07 00:19:34
 * @Description: This is description.
 */

import fs from 'fs-extra';
import { xml2js, xml2json, js2xml, json2xml, Element, ElementCompact } from 'xml-js';
import { ISettings, DotNetSettingsOptions } from '../types';
import { SettingsBase } from './SettingsBase';
import { Log } from '../helpers/Log';

export class SettingsWriter extends SettingsBase {

    constructor(rootPath: string, projectFile: string, private options: DotNetSettingsOptions) {

        super(rootPath, projectFile);
    }

    public writeSettings(settings: ISettings, overwrite?: boolean): Promise<ISettings> {

        return new Promise<ISettings>(async (resolve, reject) => {
            try {

                const settingsFileName = this.getSettingsFileName();
                if (settingsFileName && (overwrite || !fs.existsSync(settingsFileName))) {
                    Log.verbose('Create Settings File ...');
                    if (this.IsSolution) {
                        settings.Project = null;
                    } else {
                        settings.Package = null;
                        settings.Build = null;
                        settings.Version = null;
                    }

                    await fs.writeJson(settingsFileName, settings, {
                        encoding: 'utf-8',
                    });
                } else {
                    Log.warning('Settings File already exists.');
                }
                resolve(settings);
            } catch (e) {
                reject(Log.critical(e));
            }
        });
    }

    public updateProject(settings: ISettings[]): Promise<any> {

        return new Promise(async (resolve, reject) => {

            for (const setting of settings) {

                if (setting.ProjectFile) {
                    const projectData = await fs.readFile(setting.ProjectFile, { encoding: 'utf-8' });

                    const project = xml2js(projectData, {
                        compact: true,
                        alwaysChildren: true,
                        ignoreComment: true,
                    }) as ElementCompact;

                    let group = project.Project.PropertyGroup;
                    if (setting.Build) {
                        group = this.writeTextValue(group, 'AssemblyOriginatorKeyFile', setting.Build.AssemblyOriginatorKeyFile);
                        group = this.writeTextValue(group, 'Configuration', setting.Build.Configuration);
                        group = this.writeBoolValue(group, 'DelaySign', setting.Build.DelaySign);
                        group = this.writeTextValue(group, 'OutputPath', setting.Build.OutputPath);
                        group = this.writeTextValue(group, 'RuntimeIdentifiers', setting.Build.RuntimeIdentifiers);
                        group = this.writeBoolValue(group, 'SignAssembly', setting.Build.SignAssembly);
                        group = this.writeTextValue(group, 'TargetFramework', setting.Build.TargetFramework);
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
                        group = this.writeTextValue(group, 'Description', setting.Project.Description);
                        group = this.writeTextValue(group, 'PackageTags', setting.Project.PackageTags);
                        group = this.writeTextValue(group, 'RootNamespace', setting.Project.RootNamespace);
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

                    project.Project.PropertyGroup = group;
                    const projectAsXml = js2xml(project, {
                        compact: true,
                        ignoreComment: true,
                        spaces: 8,
                    });

                    await fs.writeFile(setting.ProjectFile, projectAsXml, { encoding: 'utf-8' });
                }
            }
        });
    }

    private writeTextValue(parent: ElementCompact, name: string, value: string | null): ElementCompact {

        if (value && value.length !== 0) {
            parent = this.getElementOrCreate(parent, name);
            parent[name]._text = value;
        }
        return parent;
    }

    private writeBoolValue(parent: ElementCompact, name: string, value: boolean): ElementCompact {
        parent = this.getElementOrCreate(parent, name);
        parent[name]._text = value ? 'true' : 'false';
        return parent;
    }

    private getElementOrCreate(parent: ElementCompact, name: string): ElementCompact {
        let element = parent[name];
        if (!element) {
            element = {
                [name]: {
                    _text: '',
                },
            };
            parent = { ...parent, ...element };
        }
        return parent;
    }
}
