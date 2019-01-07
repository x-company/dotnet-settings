/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: DotNetHelpers.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:57:19
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-06 23:41:06
 * @Description: This is description.
 */

import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import dns from 'dns';
import { exec } from 'child_process';
import { Log } from './Log';
import { platform } from 'os';
import nfetch from 'node-fetch';


export class DotNetHelpers {

    public static getDotNetCoreTarget(): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {

            exec('dotnet --version', {
                encoding: 'utf8',
            }, (error, installedDotnetVersion) => {
                if (error) {
                    reject(error);
                }

                if (installedDotnetVersion) {
                    if (semver.satisfies(installedDotnetVersion, '>=2.2')) {
                        installedDotnetVersion = 'netcoreapp2.2';
                    } else if (semver.satisfies(installedDotnetVersion, '>=2.1')) {
                        installedDotnetVersion = 'netcoreapp2.1';
                    } else if (semver.satisfies(installedDotnetVersion, '>=2.0')) {
                        installedDotnetVersion = 'netcoreapp2.0';
                    } else {
                        reject('No valid DotNetCore Target found.');
                    }
                }

                Log.success('Installed DotNet Core Version found.', installedDotnetVersion);
                resolve(installedDotnetVersion);
            });
        });
    }

    public static getProjectsFromSolution(solutionFile: string): Promise<string[]> {

        return new Promise<string[]>(async (resolve, reject) => {
            try {
                const data = await fs.readFile(solutionFile, { encoding: 'utf8' });

                const pattern = /[\\.\w]+.csproj/g;
                const projects = new Array<string>();
                let result;
                do {
                    result = pattern.exec(data);
                    if (result) {
                        const project = result[0];
                        let projectFilePath = path.resolve(path.join(path.dirname(solutionFile), project));
                        if (process.platform !== 'win32') {
                            projectFilePath = projectFilePath.replace('\\', '/');
                        }
                        projects.push(projectFilePath);
                        data.replace(project, '');
                    }

                } while (result);

                resolve(projects);

            } catch (e) {
                reject(e);
            }
        });
    }

    public static getRuntimeJson(): Promise<any> {
        return new Promise((resolve, reject) => {

            const checkInternet = (callback: (result: boolean) => void) => {
                dns.lookupService('google.com', 53, (error, hostname, service) => {
                    if (error && error.code === 'ENOTFOUND') {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            };

            checkInternet(async (isConnected) => {

                if (isConnected) {
                    try {
                        const url = 'https://raw.githubusercontent.com/dotnet/corefx/master/pkg/Microsoft.NETCore.Platforms/runtime.json';
                        const response = await nfetch(url);
                        if (response) {
                            const runtime = await response.json();
                            resolve(runtime);
                        } else {
                            reject(Log.critical('No Response from GitHub for runtime.json'));
                        }
                    } catch (e) {
                        reject(Log.critical(e));
                    }
                } else {
                    const runtime = require('../types/runtime.json');
                    resolve(runtime);
                }
            });
        });
    }
}
