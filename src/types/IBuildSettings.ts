/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: IBuildSettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:36:34
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-06 21:10:48
 * @Description: This is description.
 */

export interface IBuildSettings {
    TargetFramework: string | null;
    RuntimeIdentifiers: string | null;
    Configuration: string | null;
    SignAssembly: boolean;
    DelaySign: boolean;
    AssemblyOriginatorKeyFile: string | null;
    OutputPath: string | null;
}
