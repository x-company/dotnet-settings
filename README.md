# Dotnet Settings Module

[![dotnet-settings-version](https://img.shields.io/badge/Version-0.1.0-brightgreen.svg?style=flat)](https://www.npmjs.com/package/dotnet-settings/v/0.1.0)
[![dotnet-settings-status](https://img.shields.io/badge/Status-preview%201-brightgreen.svg?style=flat)](https://github.com/x-company/dotnet-settings#status)
[![dotnet-settings-build](https://img.shields.io/badge/Builds-42-brightgreen.svg?style=flat)](https://github.com/x-company/dotnet-settings#status)

This Module helps you easily to manage your .Net Core Build Settings, so it can used by an TeamBuild System or any other Meanings.

# Background
`.Net Core` defines his Build-, Package-, Version- and Project-Settings in separat `.csproj` Files. For example, if you want define the Signing of your Assembly, you have to do this separatly for each Project in each Project File. DotNet Settings Manager helps you to define your Project Settings globally.

You will get the another Benefit if you combine `dotnet-settings` with `appversion-mgr`. `appversion-mgr` controls the Versions of your Project. This informations will used by `dotnet-settings` to define the detailed Versions for each Project.

# How to use it?

## CLI Mode
Install `dotnet-settings` with ```npm install -g dotnet-settings```. After this call ```dotnetmgr --help``` to get further Informations.

## Package Mode
Install `dotnet-settings` with ```npm install dotnet-settings```. After finish you can use `dotnet-settings` in your own Node Package Project.

# Init the Settings File

Simple call ```dotnetmgr --init --solution <Path to your Solution File>```. After this action you will get per .Net Project an separat `<ProjectName>.json` File, for specific Project Settings, and a `<SolutionName>.json` for global Project Settings.

# Data Structure

Here you can see an example of an Solution- and an Project File after the Init. The Meaning of each Property could be found in [MSDN](https://docs.microsoft.com/en-us/dotnet/core/tools/csproj).

## Solution Settings

```json
{
    "ProjectFile": null,
    "Build": {
        "AssemblyOriginatorKeyFile": null,
        "Configuration": "Release",
        "DelaySign": false,
        "OutputPath": null,
        "RuntimeIdentifiers": null,
        "SignAssembly": false,
        "TargetFramework": "netcoreapp2.1"
    },
    "Package": {
        "Authors": null,
        "Company": null,
        "Copyright": null,
        "GeneratePackageOnBuild": false,
        "PackageProjectUrl": null,
        "RepositoryType": "git",
        "RepositoryUrl": null
    },
    "Project": null,
    "Version": {
        "AssemblyVersion": "0.1.0.0",
        "FileVersion": "0.1.0.0",
        "InformationalVersion": "0.1.0",
        "PackageVersion": "0.1.0",
        "Version": "0.1.0",
        "VersionPrefix": "0.1.0",
        "VersionSuffix": null
    }
}
```

## Project Settings

```json
{
    "ProjectFile": "Path to your Project File.csproj",
    "Build": null,
    "Package": null,
    "Project": {
        "Description": "A Project Description",
        "PackageTags": "Tags separated by space",
        "RootNamespace": "Namespace of your Assembly"
    },
    "Version": null
}

```

# Limitations

Only .Net Core and C# Projects are supported.
