/**
 * Copyright (c) 2019 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: SettingsBase.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2019-01-05 14:44:35
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-07 22:14:22
 * @Description: This is description.
 */

import fs from 'fs-extra';
import path from 'path';
import findRoot from 'find-root';
import { Log } from '../helpers/Log';

export class SettingsBase {

    protected IsSolution: boolean = false;
    protected FilePath: string;
    protected FileName: string;

    constructor(projectFile: string) {

        Log.verbose(`Init SettingsReader/Writer with File '${projectFile}' ...`);

        this.FileName = path.basename(projectFile);
        this.FilePath = projectFile;

        if (this.FileName.endsWith('.sln')) {
            Log.verbose('Parse .Net Solution File');
            this.IsSolution = true;

        } else if (projectFile.endsWith('.csproj')) {
            Log.verbose('Parse .Net Project File');
            this.IsSolution = false;

        } else {
            Log.error('Given File is no .Net Solution- or Project File.');
        }
    }

    protected getSettingsFileName(searchForSolutionSettings: boolean = false): string | null {
        let projectSettingsFileName: string | null = null;

        if (this.IsSolution || searchForSolutionSettings) {
            projectSettingsFileName = this.getSolutionSettingsFileName();
        } else {
            const currentFilePath = path.dirname(this.FilePath);
            const pureFileName = path.basename(this.FileName, '.csproj');
            projectSettingsFileName = path.join(currentFilePath, pureFileName + '.json');
        }

        return projectSettingsFileName;
    }

    private getSolutionSettingsFileName(): string | null {
        let solutionSettingsFileName: string | null = null;

        if (fs.existsSync(this.FilePath)) {

            try {
                const currentFilePath = path.dirname(this.FilePath);
                const solutionRooPath = findRoot(currentFilePath, (dir) => {
                    const solutionFiles = fs.readdirSync(dir).filter((fileName) => fileName.endsWith('.sln'));
                    if (solutionFiles && solutionFiles.length !== 0) {
                        const pureFileName = path.basename(solutionFiles[0], '.sln');
                        solutionSettingsFileName = path.join(dir, pureFileName + '.json');
                        return true;
                    }
                    return false;
                });
            } catch (e) {
                Log.warning(e.message);
            }
        }
        return solutionSettingsFileName;
    }
}
