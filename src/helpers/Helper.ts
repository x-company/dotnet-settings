/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * @Script: Helper.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-07-30 00:29:30
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-07-30 01:36:00
 * @Description: This is description.
 */


import findRoot from 'find-root';
import fs from 'fs-extra';
import path from 'path';

export class Helper {

    public static getRoot() {

        return findRoot(process.cwd(), (dir) => {
            return fs.existsSync(path.resolve(dir, '.git'));
        });
    }
}
