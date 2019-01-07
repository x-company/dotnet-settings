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
 * @Last Modified At: 2019-01-07 00:18:33
 * @Description: This is description.
 */

import path from 'path';
import getCallerFile from 'get-caller-file';
import { ISettings } from '../types';
import { DotNetSettingsOptions } from '../types/DotnetSettingsOptions';
import { SettingsReader } from './SettingsReader';
import { SettingsWriter } from './SettingsWriter';
import { Log } from '../helpers/Log';

export class DotNetSettings {
    private ROOTPATH: string;
    private options: DotNetSettingsOptions;

    constructor(private projectFile: string, options?: DotNetSettingsOptions) {

        const defaultOptions = {
            UseAppVersionMgr: true,
            LogLevel: 'warn',
        };

        this.options = {
            ...defaultOptions,
            ...options,
        };

        Log.init(this.options.LogLevel || 'warn');

        this.ROOTPATH = path.resolve(path.dirname(getCallerFile()));
    }

    public initSettings(overwriteExistingSettingsFile?: boolean): Promise<ISettings[]> {
        return new Promise<ISettings[]>(async (resolve, reject) => {

            try {
                const reader = new SettingsReader(this.ROOTPATH, this.projectFile, this.options);
                const settings = await reader.init(overwriteExistingSettingsFile);
                if (settings) {
                    resolve(settings);
                } else {
                    reject(Log.critical(new Error('Default Settings could not loaded.')));
                }

            } catch (err) {
                reject(Log.critical(err));
            }
        });
    }

    public updateProjects(): Promise<any> {

        return new Promise(async (resolve, reject) => {
            try {
                const reader = new SettingsReader(this.ROOTPATH, this.projectFile, this.options);
                const settings = await reader.read();

                if (settings) {
                    const writer = new SettingsWriter(this.ROOTPATH, this.projectFile, this.options);
                    await writer.updateProject(settings);
                }
                resolve();
            } catch (e) {
                reject(Log.critical(e));
            }
        });
    }
}
