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
 * @Last Modified At: 2020-03-08 20:09:57
 * @Description: This is description.
 */

export interface IBuildSettings {
    TargetFramework: string | null;
    RuntimeIdentifiers: string | null;
    Configuration: string | null;
    AssemblyOriginatorKeyFile: string | null;
    OutputPath: string | null;
    SignAssembly: boolean | null;
    DelaySign: boolean | null;
    GenerateDocumentationFile: boolean | null;
}
