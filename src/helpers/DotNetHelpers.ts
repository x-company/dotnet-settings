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
 * @Last Modified At: 2019-08-31 15:27:52
 * @Description: This is description.
 */

import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import dns from 'dns';
import { Log } from './Log';
import nfetch from 'node-fetch';
import { Shell } from './Shell';


export class DotNetHelpers {

    public static async getDotNetCoreTarget(): Promise<string> {

        try {
            let installedDotnetVersion = await Shell.execute('dotnet', ['--version'], {
                silent: true,
                windowsHide: true,
                detached: true,
            });

            if (installedDotnetVersion) {
                installedDotnetVersion = installedDotnetVersion.trim();
                if (semver.satisfies(installedDotnetVersion, '>=3.1')) {
                    installedDotnetVersion = 'netcoreapp3.1';
                } else if (semver.satisfies(installedDotnetVersion, '>=3.0')) {
                    installedDotnetVersion = 'netcoreapp3.0';
                } else if (semver.satisfies(installedDotnetVersion, '>=2.2')) {
                    installedDotnetVersion = 'netcoreapp2.2';
                } else if (semver.satisfies(installedDotnetVersion, '>=2.1')) {
                    installedDotnetVersion = 'netcoreapp2.1';
                } else if (semver.satisfies(installedDotnetVersion, '>=2.0')) {
                    installedDotnetVersion = 'netcoreapp2.0';
                } else {
                    throw new Error('No valid DotNetCore Target found.');
                }
            }

            Log.info('Installed DotNet Core Version found.', installedDotnetVersion);
            return installedDotnetVersion;
        } catch (err) {
            throw err;
        }
    }

    public static async getProjectsFromSolution(solutionFile: string): Promise<string[]> {

        try {
            const data = await fs.readFile(solutionFile, { encoding: 'utf8' });
            const solutionDir = path.dirname(solutionFile);

            const pattern = /[\\.\w]+.csproj/g;
            const projects = new Array<string>();
            let result;
            do {
                result = pattern.exec(data);
                if (result) {
                    let project = result[0];
                    project = project.split('\\').join('/');

                    const projectFilePath = path.resolve(path.join(solutionDir, project));
                    projects.push(projectFilePath);
                    data.replace(project, '');
                }

            } while (result);

            return projects;

        } catch (e) {
            throw e;
        }

    }

    public static async getRuntimeJson(): Promise<any> {

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
                    const url = 'https://raw.githubusercontent.com/dotnet/runtime/master/src/libraries/pkg/Microsoft.NETCore.Platforms/runtime.json';
                    const response = await nfetch(url);
                    if (response) {
                        const runtime = await response.json();
                        return runtime;
                    } else {
                        throw new Error('No Response from GitHub for runtime.json');
                    }
                } catch (e) {
                    throw e;
                }
            } else {
                const runtime = require('../types/runtime.json');
                return runtime;
            }
        });

    }
}
