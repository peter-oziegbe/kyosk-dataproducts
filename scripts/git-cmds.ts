import {executeCmd } from "./execute-shell-cmd.js";


export async function getCurrentBranch():Promise<string>{
    let branch = (await executeCmd("git branch --show-current")).stdout
    return branch;
}


export async function getChangedRootPaths():Promise<string[]>{
    let res = (await executeCmd('git diff HEAD HEAD^ --name-only | cut -d "/" -f2 | sort -u')).stdout
    return res.trim().split("\n");
}