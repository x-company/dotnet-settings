/**
 * Copyright 2019 Roland Breitschaft <roland.breitschaft@x-company.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @Script: ShellOptions.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-02-07 01:21:04
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-07-29 22:55:08
 * @Description: This is description.
 */


export interface ShellOptions {
    cwd?: string;
    windowsHide?: boolean;
    detached?: boolean;
    shell?: boolean;
    silent?: boolean;
}
