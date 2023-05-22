
import { Builder } from 'builder-pattern';
import projects from '../project.json' assert { type: "json" };

export enum ProjectType{
    LIB,APP
}

export class Project{
    type:ProjectType;
    isNative:boolean;
    isPublishable:boolean;
    name:string;
    path:string;
}

export function getProject(path:string):Project {
    let project =getApp(path);
    if(project == null){
        project = getLib(path)
    }
    return project;
}

function getApp(path:String):Project{
    let def = getAppDef(path);
    if(def == null){
        return null;
    } 

   let app = Builder<Project>()
            .type(ProjectType.APP)
            .isNative(def["isNative"] || true)
            .name(def.name)
            .path(def["path"] || def.name)
            .build();
    return app;
}

function getLib(path:String):Project{
    let def = getLibDef(path);
    if(def == null){
        return null;
    } 

   let lib = Builder<Project>()
            .type(ProjectType.APP)
            .isPublishable(def["publishable"] || false)
            .name(def.name)
            .path(def["path"] || def.name)
            .build();
    return lib;
}

function getLibDef(path:String){
    return projects.libs.find(x => x.name === path);
}

function getAppDef(path:String){
    return projects.apps.find(x => x.name === path);
}