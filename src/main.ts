import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

async function run() {
  try {
    const nugetApiKey = core.getInput('nuget-api-key')
  
    let workspace = core.getInput('workspace')
    if (workspace == '') {
      workspace = '.'
    }

    let nupkgFile = core.getInput('nupkg')
    if (nupkgFile == '') {
      nupkgFile = path.join(path.dirname(workspace), 'bin/Release/*.nupkg')
    }

    const forceVersion = core.getInput('version')
    let packParams = ''
    if (forceVersion != '') {
      packParams = `-p:PackageVersion=${forceVersion}`
    }

    core.info(`dotnet pack ${packParams} ${workspace}`)
    exec.exec(`dotnet pack ${packParams} ${workspace} -Verbosity detailed`)

    core.info(`./nuget.exe push ${nupkgFile}`)
    exec.exec(`./nuget.exe push ${nupkgFile} -ApiKey ${nugetApiKey} -Source https://api.nuget.org/v3/index.json  -Verbosity detailed`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
