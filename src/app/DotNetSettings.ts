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
 * @Last Modified At: 2019-01-07 22:16:03
 * @Description: This is description.
 */

import path from 'path';
import fs from 'fs';
import { ISettings } from '../types';
import { DotNetSettingsOptions } from '../types/DotnetSettingsOptions';
import { SettingsReader } from './SettingsReader';
import { SettingsWriter } from './SettingsWriter';
import { Log } from '../helpers/Log';


export class DotNetSettings {
    private solutionFile: string;
    private options: DotNetSettingsOptions;

    constructor(projectFile: string, options?: DotNetSettingsOptions) {

        const defaultOptions = {
            UseAppVersionMgr: true,
            LogLevel: 'warn',
        };

        this.options = {
            ...defaultOptions,
            ...options,
        };

        Log.init(this.options.LogLevel || 'warn');

        const workingDir = process.cwd();
        const projectDir = path.dirname(projectFile);
        const solutionDir = path.resolve(path.join(workingDir, projectDir));
        this.solutionFile = path.join(solutionDir, path.basename(projectFile));

        Log.verbose('workingDir:', workingDir);
        Log.verbose('solutionDir:', solutionDir);
        Log.verbose('solutionFile:', this.solutionFile);

        if (!fs.existsSync(this.solutionFile)) {
            throw new Error(`Solution '${this.solutionFile}' could not found.`);
        }
    }

    public initSettings(overwriteExistingSettingsFile?: boolean): Promise<any> {
        return new Promise(async (resolve, reject) => {

            try {
                const reader = new SettingsReader(this.solutionFile, this.options);
                await reader.init(overwriteExistingSettingsFile);
                resolve();

            } catch (err) {
                reject(Log.critical(err));
            }
        });
    }

    public updateProjects(): Promise<any> {

        return new Promise(async (resolve, reject) => {
            try {
                const reader = new SettingsReader(this.solutionFile, this.options);
                const settings = await reader.read();

                if (settings) {
                    const writer = new SettingsWriter(this.solutionFile, this.options);
                    await writer.updateProject(settings);
                }
                resolve();
            } catch (e) {
                reject(Log.critical(e));
            }
        });
    }
}
