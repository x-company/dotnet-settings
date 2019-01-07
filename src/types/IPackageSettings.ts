/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 *
 * @Script: IPackageSettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:58:01
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-05 13:44:59
 * @Description: This is description.
 */


export interface IPackageSettings {
    Authors: string | null;
    Company: string | null;
    Copyright: string | null;
    PackageProjectUrl: string | null;
    RepositoryUrl: string | null;
    RepositoryType: string | null;
    GeneratePackageOnBuild: boolean;
}
