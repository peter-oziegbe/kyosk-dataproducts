
import { exec, PromiseWithChild,spawn } from "child_process";
import { promisify }from 'util';
import chalk from 'chalk';
import { resolve } from "path";
import { rejects } from "assert";

let execPromise = promisify(exec);

export interface ShellCmdResponse{
    stdout: string;
    stderr: string;  
}

export async function executeCmd(cmd:string): Promise<ShellCmdResponse>{
    let res = execPromise(cmd);
    return  res
}

 export async function executeCmdStreamOutput(cmd:string,options:string[]): Promise<boolean>{
    let xxx = spawn(cmd,options)
    
     xxx.stdout.on("data",(data)=>{ 
        console.log(chalk.green(data.toString()))
    })

    xxx.stderr.on("data",(error)=>{
        console.log(chalk.red("error:",error))
    })

   

    let prom = new Promise<boolean>((resolve,reject)=> {
        xxx.on("close",(code)=>{
            if(code === 1){
                reject(1)
            }
            else{
                resolve(true)
            }
            console.log(chalk.bgRed("code:",code))
        })
    });

    return prom;
}