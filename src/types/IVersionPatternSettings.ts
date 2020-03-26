/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: IVersionPatternSettings.ts
 * @Script: IVersionPatternSettings.ts
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-07-31 10:00:29
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-11-14 15:27:00
 * @Last Modified At: 2019-11-14 15:15:45
 */


export interface IVersionPatternSettings {
    AssemblyVersion: string;
    FileVersion: string;
    InformationalVersion: string;
    PackageVersion: string;
    Version: string;
    VersionPrefix: string;
    VersionSuffix: string;
}
