"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nugetApiKey = core.getInput('nuget-api-key');
            let workspace = core.getInput('workspace');
            if (workspace == '') {
                workspace = '.';
            }
            let nupkgFile = core.getInput('nupkg');
            if (nupkgFile == '') {
                nupkgFile = path.join(path.dirname(workspace), 'bin/Release/*.nupkg');
            }
            const forceVersion = core.getInput('version');
            let packParams = '';
            if (forceVersion != '') {
                packParams = `-p:PackageVersion=${forceVersion}`;
            }
            core.info(`dotnet pack ${packParams} ${workspace}`);
            exec.exec(`dotnet pack ${packParams} ${workspace} -Verbosity detailed`);
            core.info(`nuget.exe push ${nupkgFile}`);
            exec.exec(`nuget.exe push ${nupkgFile} -ApiKey ${nugetApiKey} -Source https://api.nuget.org/v3/index.json  -Verbosity detailed`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
