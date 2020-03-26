/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: Updater.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-07 19:57:19
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-07 22:26:30
 * @Description: This is description.
 */

import dns from 'dns';
import nfetch from 'node-fetch';
import semver from 'semver';
import { Log } from '../helpers/Log';
import { Info } from '../info';

export class Updater {
    /**
     * This function checks for an update of DotNet Settings.
     *
     * @static
     * @memberof Updater
     */
    public static checkUpdate() {

        Log.verbose('Check for Programm Updates');

        const checkInternet = (callback: (result: boolean) => void) => {
            dns.lookup('www.google.com', (error, hostname, service) => {
                if (error && error.code === 'ENOTFOUND') {
                    Log.warning('No Internet Connection available. Update Checks not possible.');
                    callback(false);
                } else {
                    Log.verbose('We have an Internet Connection. Perform an Update Check.');
                    callback(true);
                }
            });
        };

        checkInternet((isConnected) => {

            if (isConnected) {
                const currentVersion = Info.getProductVersion();
                nfetch('https://registry.npmjs.org/dotnet-settings/latest')
                    .then((response) => {
                        try {
                            response.json()
                                .then((json) => {
                                    if (json !== 'Not Found') {
                                        const latest = json.version;
                                        if (semver.gt(latest, currentVersion)) {
                                            Log.info(`New dotnetmgr version available, run 'npm install dotnet-settings -g' to update!`);
                                        } else {
                                            Log.verbose('No new dotnet-settings version available.');
                                        }
                                    }
                                });
                        } catch (error) {
                            Log.error(error);
                        }
                    })
                    .catch((error) => {
                        if (error && error.code === 'ENOTFOUND') {
                            return;
                        }

                        if (error) {
                            Log.error(error);
                        }
                    });
            }
        });
    }
}
