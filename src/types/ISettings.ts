/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: ISettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:58:22
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-06 20:30:16
 * @Description: This is description.
 */

import { IBuildSettings } from './IBuildSettings';
import { IPackageSettings } from './IPackageSettings';
import { IProjectSettings } from './IProjectSettings';
import { IVersionSettings } from './IVersionSettings';

export interface ISettings {
    ProjectFile: string | null;
    Build: IBuildSettings | null;
    Package: IPackageSettings | null;
    Project: IProjectSettings | null;
    Version: IVersionSettings | null;
}
