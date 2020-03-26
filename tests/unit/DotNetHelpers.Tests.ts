/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: DotNetHelpers.Tests.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-21 16:57:02
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-07-29 23:13:50
 * @Description: This is description.
 */

import { assert } from 'chai';
import { DotNetHelpers } from '../../src/helpers/DotNetHelpers';

describe('Testing DotNetHelpers', () => {

    it('Retrieve installed DotNet Version', async () => {

        try {
            const actual = await DotNetHelpers.getDotNetCoreTarget();
            assert.equal(actual, 'netcoreapp3.1');

        } catch (e) {
            throw e;
        }
    });
});
