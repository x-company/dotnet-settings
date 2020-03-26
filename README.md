# Dotnet Settings Module

[![dotnet-settings-version](https://img.shields.io/badge/Version-0.5.9-brightgreen.svg?style=flat)](https://www.npmjs.com/package/dotnet-settings/v/0.5.9)
[![dotnet-settings-status](https://img.shields.io/badge/Status-preview%201-brightgreen.svg?style=flat)](https://github.com/x-company/dotnet-settings#status)
[![dotnet-settings-build](https://img.shields.io/badge/Builds-96-brightgreen.svg?style=flat)](https://github.com/x-company/dotnet-settings#status)

This Module helps you easily to manage your .Net Core Build Settings, so it can used by an TeamBuild System or any other Meanings.

# Background
`.Net Core` defines his Build-, Package-, Version- and Project-Settings in separat `.csproj` Files. For example, if you want define the Signing of your Assembly, you have to do this separatly for each Project in each Project File. DotNet Settings Manager helps you to define your Project Settings globally.

You will get the another Benefit if you combine `dotnet-settings` with `appversion-mgr`. `appversion-mgr` controls the Versions of your Project. This informations will used by `dotnet-settings` to define the detailed Versions for each Project.

# How to use it?

## CLI Mode
Install `dotnet-settings` with ```npm install -g dotnet-settings```. After this call ```dotnetmgr --help``` to get further Informations.

## Package Mode
Install `dotnet-settings` with ```npm install dotnet-settings```. After finish you can use `dotnet-settings` in your own Node Package Project.

```typescript
// Sample
// For Pattern Details see https://www.npmjs.com/package/appversion-mgr

import { DotNetSettings } from 'dotnet-settings';

const solutionFile=''
const settings = new DotNetSettings(solutionFile, {
    UseAppVersionMgr: true,
    LogLevel: 'warn',    
});

// Init Settings with overwriting existing Settings,
settings.initSettings(true);
// or Init Settings without overwriting
settings.initSettings();

// Update existing Project Settings, for example while Teambuild is running
settings.updateProject();

```

# Init the Settings File

Simple call ```dotnetmgr --init --solution <Path to your Solution File>```. After this action you will get per .Net Project an separat `<ProjectName>.json` File, for specific Project Settings, and a `<SolutionName>.json` for global Project Settings.

# Data Structure

Here you can see an example of an Solution- and an Project File after the Init. The Meaning of each Property could be found in [MSDN](https://docs.microsoft.com/en-us/dotnet/core/tools/csproj).

## Solution Settings

This Settings are global for all Projects and will inherited to each Project found in the Solution File.

```json
{
    "Build": {
        "AssemblyOriginatorKeyFile": null,
        "Configuration": "Release",
        "DelaySign": false,
        "OutputPath": null,
        "RuntimeIdentifiers": null,
        "SignAssembly": false,
        "TargetFramework": "netcoreapp2.2",
        "GenerateDocumentationFile": false
    },
    "Package": {
        "Authors": null,
        "Company": null,
        "Copyright": null,
        "GeneratePackageOnBuild": false,
        "PackageProjectUrl": null,
        "RepositoryType": "git",
        "RepositoryUrl": null,
        "BadgeBaseUrl": null
    },
    "Version": {
        "AssemblyVersion": "0.1.0.0",
        "FileVersion": "0.1.0.0",
        "InformationalVersion": "0.1.0",
        "PackageVersion": "0.1.0",
        "Version": "0.1.0",
        "VersionPrefix": "0.1.0",
        "VersionSuffix": null
    },
    "Pattern": {
        "AssemblyVersion": "M.m.p.t",
        "FileVersion": "M.m.p.t",
        "InformationalVersion": "M.m.p-S.s-t",
        "PackageVersion": "M.m.p-S.s-t",
        "Version": "M.m.p",
        "VersionPrefix": "M.m.p",
        "VersionSuffix": "S.s-t",
    }
}
```

## Project Settings

Override specific Settings for each Project.

```json
{
    "ProjectFile": "Path to your Project File.csproj",
    "Project": {
        "Description": "A Project Description",
        "PackageTags": "Tags separated by space",
        "RootNamespace": "Namespace of your Assembly",
        "AssemblyName": "Sample.Core",
        "IsTestProject": false
    }    
}

```

# Limitations

Only .Net Core and C# Projects are supported.
