/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: IProjectSettings.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:58:11
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-05 13:47:25
 * @Description: This is description.
 */

export interface IProjectSettings {
    RootNamespace: string | null;
    Description: string | null;
    PackageTags: string | null;

}
