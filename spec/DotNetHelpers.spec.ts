/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: DotNetHelpers.spec.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:57:02
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-05 15:36:11
 * @Description: This is description.
 */

import { DotNetHelpers } from '../src/helpers/DotNetHelpers';

describe('Testing DotNetHelpers', () => {

    it('Retrieve installed DotNet Version', async (done) => {

        try {
            const actual = await DotNetHelpers.getDotNetCoreTarget();
            expect(actual).toEqual('netcoreapp2.1');
            done();
        } catch (e) {
            done.fail(e);
        }
    });
});
