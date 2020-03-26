/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: DotNetSettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 17:10:49
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2020-02-19 10:20:41
 * @Description: This is description.
 */

import path from 'path';
import fs from 'fs';
import globby from 'globby';
import { DotNetSettingsOptions } from '../types/DotnetSettingsOptions';
import { SettingsReader } from './SettingsReader';
import { SettingsWriter } from './SettingsWriter';
import { Log } from '../helpers/Log';
import { Helper } from '../helpers/Helper';
import { DotNetHelpers } from '../helpers/DotNetHelpers';


export class DotNetSettings {
    private solutionFile: string;
    private options: DotNetSettingsOptions;

    constructor(solutionFile: string, options?: DotNetSettingsOptions) {

        const defaultOptions: DotNetSettingsOptions = {
            UseAppVersionMgr: true,
            LogLevel: 'warn',
        };

        this.options = {
            ...defaultOptions,
            ...options,
        };

        Log.init(this.options.LogLevel || 'warn');

        const rootDir = Helper.getRoot();
        this.solutionFile = path.join(rootDir, solutionFile);

        if (!fs.existsSync(this.solutionFile)) {
            throw new Error(`Solution '${this.solutionFile}' could not found.`);
        }

        Log.verbose('rootDir:', rootDir);
        Log.verbose('solutionFile:', this.solutionFile);
    }

    public async initSettings(overwriteExistingSettingsFile?: boolean): Promise<any> {
        try {
            const projects = await DotNetHelpers.getProjectsFromSolution(this.solutionFile);
            let reader = null;
            for (const project of projects) {
                reader = new SettingsReader(this.options, this.solutionFile, project);
                await reader.init(overwriteExistingSettingsFile);
            }
            Log.success('Your Projects successful prepared.');

            reader = new SettingsReader(this.options, this.solutionFile);
            await reader.init(overwriteExistingSettingsFile);
            Log.success('Your Solution successful prepared.');

        } catch (err) {
            throw err;
        }
    }

    public async updateProjects(): Promise<any> {

        try {
            let reader = new SettingsReader(this.options, this.solutionFile);
            await reader.upgradeSchema();

            const projects = await DotNetHelpers.getProjectsFromSolution(this.solutionFile);
            for (const project of projects) {
                reader = new SettingsReader(this.options, this.solutionFile, project);
                await reader.upgradeSchema();

                const settings = await reader.read();

                if (settings) {
                    const writer = new SettingsWriter(this.solutionFile, project, this.options);
                    await writer.updateProject(settings);
                }
            }
            Log.success('Your Projects successful updated.');

        } catch (e) {
            throw e;
        }
    }
}
