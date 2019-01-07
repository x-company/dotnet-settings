/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: build.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-22 09:50:35
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-07 00:11:43
 * @Description: This is description.
 */



import { DotNetSettings } from '../lib';

const settings = new DotNetSettings('./src/SampleSolution.sln', {
    UseAppVersionMgr: true,
});

// Init Default Settings
const initSettingsFn = async () => {
    const projectSettings = await settings.initSettings(true);
    console.log('Project Initial Settings', projectSettings);

    // Write Settings to DotNet Projects
    await settings.updateProjects();
};
initSettingsFn();
