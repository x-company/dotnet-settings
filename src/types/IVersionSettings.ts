/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: IVersionSettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:58:33
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-05 13:46:51
 * @Description: This is description.
 */


export interface IVersionSettings {
    Version: string | null;
    VersionPrefix: string | null;
    VersionSuffix: string | null;
    FileVersion: string | null;
    PackageVersion: string | null;
    AssemblyVersion: string | null;
    InformationalVersion: string | null;
}
