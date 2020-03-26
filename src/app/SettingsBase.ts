/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: SettingsBase.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-05 14:44:35
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2020-03-08 19:40:38
 * @Description: This is description.
 */

import path from 'path';
import { Log } from '../helpers/Log';
import { ElementCompact } from 'xml-js';
import { DotNetHelpers } from '../helpers/DotNetHelpers';

export class SettingsBase {

    protected IsSolution: boolean;
    protected ProjectFilePath: string = '';
    protected ProjectFileName: string = '';
    protected SolutionFilePath: string;
    protected SolutionFileName: string;

    constructor(solutionFile: string, projectFile?: string) {

        Log.verbose(`Init SettingsReader/Writer for Solution '${solutionFile}' ...`);

        this.SolutionFileName = path.basename(solutionFile);
        this.SolutionFilePath = solutionFile;
        this.IsSolution = true;

        if (projectFile && projectFile.length > 0) {
            Log.verbose(`Init SettingsReader/Writer for Project '${projectFile}' ...`);
            this.IsSolution = false;
            this.ProjectFileName = path.basename(projectFile);
            this.ProjectFilePath = projectFile;
        }
    }

    protected getSettingsFileName(forSolution: boolean = false): string | null {

        let currentFilePath = '';
        let pureFileName = '';

        if (forSolution) {
            currentFilePath = path.dirname(this.SolutionFilePath);
            pureFileName = path.basename(this.SolutionFileName, '.sln');
        } else {
            if (!this.IsSolution) {
                currentFilePath = path.dirname(this.ProjectFilePath);
                pureFileName = path.basename(this.ProjectFileName, '.csproj');
            } else {
                return null;
            }
        }
        return path.join(currentFilePath, pureFileName + '.json');
    }

    protected readTextValue(value: any, defaultValue?: string): string | null {
        if (value) {
            return value._text;
        }

        if (defaultValue) {
            return defaultValue;
        }

        return null;
    }

    protected readBoolValue(value: any, defaultValue: boolean): boolean {
        if (value) {
            return !!JSON.parse(String(value._text).toLowerCase());
        }

        return defaultValue;
    }

    protected writeTextValue(parent: ElementCompact, name: string, value: string | null): ElementCompact {

        if (value && value.length !== 0) {
            parent = this.getElementOrCreate(parent, name);
            parent[name]._text = value;
        } else {
            delete parent[name];
        }

        return parent;
    }

    protected searchGroup(project: ElementCompact) {
        let group = project.Project.PropertyGroup;

        if (group && group.length > 1) {
            // More than one PropertyGroups defined
            for (const tmpGroup of group) {
                const result = this.readTextValue(tmpGroup.TargetFramework);
                if (result) {
                    // Right Property Group found
                    group = tmpGroup;
                    break;
                }
            }
        }
        return group;
    }

    protected replaceGroup(project: ElementCompact, group: any) {

        if (project.Project.PropertyGroup && project.Project.PropertyGroup.length > 1) {
            // More than one PropertyGroups defined
            for (let index = 0; index < project.Project.PropertyGroup.length; index++) {
                const tmpGroup = project.Project.PropertyGroup[index];
                const result = this.readTextValue(tmpGroup.TargetFramework);
                if (result) {
                    // Right Property Group found
                    project.Project.PropertyGroup[index] = group;
                    break;
                }
            }
        } else {
            project.Project.PropertyGroup = group;
        }
        return project;
    }


    protected writeBoolValue(parent: ElementCompact, name: string, value: boolean | null): ElementCompact {
        parent = this.getElementOrCreate(parent, name);
        if (value) {
            parent[name]._text = 'true';
        } else {
            delete parent[name];
        }
        return parent;
    }

    protected async searchDotNetTarget(): Promise<string> {
        let target = 'netcoreapp2.2';
        try {
            target = await DotNetHelpers.getDotNetCoreTarget();
        } catch (err) {
            Log.warning(err);
        }
        return target;
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
