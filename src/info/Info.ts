/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: Info.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-07 19:34:39
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-07 19:56:01
 * @Description: This is description.
 */

import { Log } from '../helpers/Log';



export class Info {
    /**
     * The current Program Version
     *
     * @static
     * @returns { string } A Program Version
     * @memberof Info
     */
    public static getProductVersion(): string {

        Log.verbose('Get Product Version');

        return Info.PROG_VERSION;
    }

    /**
     * Returns the Schema Version of the AppVersion File
     *
     * @static
     * @returns {string}    A Schema Version
     * @memberof Info
     */
    public static getSchemaVersion(): string {

        Log.verbose('Get Data Schema Version');

        return Info.SCHEMA_VERSION;
    }

    private static PROG_VERSION: string = '0.1.0';
    private static SCHEMA_VERSION: string = '1.11.1';
}
