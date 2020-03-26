#! /usr/bin/env node

/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: dotnetmgr.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-07 19:26:24
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-11-14 21:20:10
 * @Description: This is description.
 */

import { Command } from 'commander';
import { Info } from '../info';
import { Updater } from '../updater/Updater';
import { DotNetSettings } from '../app';
import { Log } from '../helpers/Log';

Updater.checkUpdate();

const program = new Command();

program
    .version(Info.getProductVersion())
    .description('dotnetmgr is a CLI tool whose purpose is to manage your .Net Core Solution and Project Settings.');

program
    .command('init')
    .description('Generates DotNet Settings file foreach found Solution or Project File.')
    .option('-s, --solution <file>', 'Specifies the Solution File.')
    .option('-f, --force', 'Overwrites existing DotNet Settings Files. All existing Settings will lost.')
    .option('-v, --verbose', 'Shows verbose Messages')
    .option('--no-auto-update', 'Don\'t use AppVersion Manager to update the Versions.')
    .action(async (options) => {

        let level = 'warn';
        if (options.verbose) {
            level = 'verbose';

        }
        const solution = options.solution || undefined;

        try {
            let autoupdate = true;
            if (!options.autoUpdate) {
                autoupdate = false;
            }

            const settings = new DotNetSettings(solution, {
                UseAppVersionMgr: autoupdate,
                LogLevel: level,
            });
            if (options.force) {
                await settings.initSettings(true);
            } else {
                await settings.initSettings(false);
            }
        } catch (e) {
            Log.critical(e);
        }
    });

program
    .command('update')
    .description('Updates the DotNet Project Files with the defined Settings.')
    .option('-s, --solution <file>', 'Specifies the Solution File.')
    .option('-v, --verbose', 'Shows verbose Messages')
    .option('--no-auto-update', 'Don\'t use AppVersion Manager to update the Versions.')
    .action(async (options) => {

        let level = 'warn';
        if (options.verbose) {
            level = 'verbose';
        }
        const solution = options.solution || undefined;

        try {
            let autoupdate = true;
            if (!options.autoUpdate) {
                autoupdate = false;
            }

            const settings = new DotNetSettings(solution, {
                UseAppVersionMgr: autoupdate,
                LogLevel: level,
            });
            await settings.updateProjects();
        } catch (e) {
            Log.critical(e);
        }
    });


if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv);
