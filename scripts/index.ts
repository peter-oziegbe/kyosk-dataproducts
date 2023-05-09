import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { argv } from "node:process";


import { ShellCmdResponse, executeCmd, executeCmdStreamOutput} from "./execute-shell-cmd.js";
import { getChangedRootPaths } from './git-cmds.js';
import { getProject, ProjectType } from "./projects.js";



export const main = async (): Promise<void> => {

    clear(true)
    //console.log(chalk.blue(figlet.textSync('Kyosk CLI', { horizontalLayout: 'full' })));
    console.log("argv", argv[2])


    let res:string [] = []
    if(argv[2] != null){
        res = [argv[2]]
    }
    else{
        res = await getChangedRootPaths();
    }
    console.log("res",res)

    res.forEach(async path => {
        let app = getProject(path);

        if(app == null){
            console.log(chalk.red("Project is not in publishable list"))
            await executeCmd('echo "publishable=false" >> $GITHUB_OUTPUT')
            return
        }

        if(app.type === ProjectType.APP){
            console.log(chalk.green(" We are building  ",app.name))
            // turn on flag to publish to BSR
            try {
                await executeCmd('echo "publishable=false" >> $GITHUB_OUTPUT')
            } catch (error) {
                console.log(chalk.red("Could not Build ",app.name))
                throw new Error(error)
            }
        }
    })

}

main()