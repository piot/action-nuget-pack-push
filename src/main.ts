import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {
    const nugetApiKey = core.getInput('nuget-api-key')
  
    let workspace = core.getInput('workspace')
    if (workspace == '') {
      workspace = '.'
    }

    let nupkgFile = core.getInput('nupkg')
    if (nupkgFile == '') {
      const workspaceIsDirectory = fs.existsSync(workspace) && fs.lstatSync(workspace).isDirectory()

      let workspaceDirectory = workspace
      if (!workspaceIsDirectory) {
        workspaceDirectory = path.dirname(workspace)
      }
      nupkgFile = path.join(workspaceDirectory, 'bin/Release/*.nupkg')
    }

    const forceVersion = core.getInput('version')
    let packParams = ''
    if (forceVersion != '') {
      packParams = `-p:PackageVersion=${forceVersion}`
    }

    core.info(`dotnet pack ${packParams} ${workspace}`)
    await exec.exec(`dotnet pack ${packParams} ${workspace}`)

    core.info(`./nuget.exe push ${nupkgFile}`)
    await exec.exec(`./nuget.exe push ${nupkgFile} -ApiKey ${nugetApiKey} -Source https://api.nuget.org/v3/index.json  -Verbosity detailed`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
