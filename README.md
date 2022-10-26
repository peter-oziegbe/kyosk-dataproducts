# Data Products

## Repository

The repository is primarily owned by that [data team](https://github.com/orgs/Kyosk-Digital/teams/data-team). They have central control of things like managing shared code, CI/CD actions etc. The rest of the teams are controlled via the codeowners file located in `$Root/.*github/CODEOWNERS`*  

## Data Products Catalog
This is a [link](https://docs.google.com/spreadsheets/d/1u1e8-UPZNWvEabw5Fa_MoXzHkjdVpb-j7Vf4c0L4AnA/edit?usp=sharing) to google sheets with itemasation of the dataproducts and where they can be found

## Protobuf
We are currently using version 3.20.5 of protoc. The different versions available can be found in [google protobuf](https://github.com/protocolbuffers/protobuf) repository.
```
protoc --version
```

## Directory Structure

The repository at the root level is arranged by the different squads we have in kyosk. 

```
.
├── ./bin (*protoc arch compile options*)
│   └── ./bin/scripts (central build scripts)
├── ./demo (*demo squad to showcase dir structure and buf operation*)
│   ├── ./demo/gen (*folder where all demo squads autogenerated scrips will be* )
│   │   └── ./demo/gen/java-src (*Root gradle project(manually created) autogenerated java files will be place in either data or testData submodules* )
│   │       ├── ./demo/gen/java-src/data (*gradle submodule with* *protoc files for data entity*)
│   │       │   └── ./demo/gen/java-src/data/src
│   │       ├── ./demo/gen/java-src/gradle
│   │       │   └── ./demo/gen/java-src/gradle/wrapper
│   │       └── ./demo/gen/java-src/testData (*gradle submodule with* *protoc files for test server/client. These are all files that end in _test.proto*)
│   │           └── ./demo/gen/java-src/testData/src 
│   └── ./demo/protos (*this is where .proto files are defined*)
│       ├── ./demo/protos/paymentapis (*a subdomain or demo*)
│       │   └── ./demo/protos/paymentapis/v1
│       └── ./demo/protos/petapis (*a subdomain or demo*)
│           └── ./demo/protos/petapis/pet
│               └── ./demo/protos/petapis/pet/v1
├── ./ibs  ( *IBS squad base dir*)
├── ./order_fulfillment ( *OF squad root dir*)
│   └── ./order_fulfillment/protos
├── ./payments ( *Payments squad root dir*)
│   └── ./payments/protos
├── ./retail_experience ( *RE squad root dir*)
│   └── ./retail_experience/protos
└── ./vas ( *VAS squad root dir*)
    └── ./vas/protos
```

- Operations
    
    Most operations (linting, breaking change checks ) must be run within the squad root directory using the below command
    
    ```bash
    # to perform lint checks
    buf lint
    
    #To check breaking changes against master 
    #NB the subdir should be your squad root dir
    buf breaking --against="../.git#branch=master,subdir=demo"
    
    #to generate source code
    ../bin/scripts/commands 
    ```
    
    - Source Code Generation
        
        The *`buf.gen.yaml`* files that control source code generation will be found under `bin/scripts`
        
        - **gRPC generator binaries**
            
            For most languages 2 generator plugins are run:
            1. To generate plain objects, their builders, Serializers & deserializers
            2. To generate gRPC server and client. 
            
            The specifics of the plugins run can be seen in the `$Root/bin/scripts/buf.gen.yaml`. At the moment we support below hardware setups and their executables can be found in `$Root/bin` folder:
            
            - osx-aarch_64 (mac m1)
            - linux-x86_64  ([github actions](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources))
            - windows-x86_64

        - **Adding a new gRPC Generator binary**

            You can find the generator from [maven](https://mvnrepository.com/artifact/io.grpc/protoc-gen-grpc-java/1.49.1) when you click on the [files](https://repo1.maven.org/maven2/io/grpc/protoc-gen-grpc-java/1.49.1/) section. 
            
            Copy it into your `$Root/bin` folder and create a *`buf.gen.yaml`* file that points to it. You can then run `buf generate —template <new buf file>`

        - **Generating sources using the `commands` shell script**
      
          *[Downloading `protoc` compiler (Skip this section if you already have `protoc` compiler)]*
            1. Download `protoc` compiler from [Protoc Installation Site](https://grpc.io/docs/protoc-installation/)
            2. Add the path to the downloaded folder to your PATH environment variable
      
          *[Downloading `jq` and `yq` binaries (For Windows Users) - Skip this section if you already have `jq` and `yq` or are not a Windows user]*
            1. Download `jq` binary from [jq Download Page](https://stedolan.github.io/jq/download/)
            2. Rename the downloaded executable to `jq.exe` (so that you don't have to modify the `commands` shell script)
            3. Add the path to the downloaded executable to your PATH environment variable
            4. Download `yq` binary from [yq GitHub Release Page](https://github.com/mikefarah/yq/#install)
            5. Rename the downloaded executable to `jq.exe` (so that you don't have to modify the `commands` shell script)
            6. Add the path to the downloaded executable to your PATH environment variable
          
          *[Downloading `buf` binaries (For Windows Users) - Skip this section if you already have `buf` or are not a Windows user]*
          1. Download `buf` binary from [Buf GitHub Releases](https://github.com/bufbuild/buf/releases/tag/v1.9.0) or [Buf Installation](https://docs.buf.build/installation)
          2. Rename the downloaded executable to `buf.exe` (so that you don't have to modify the `commands` shell script)
          3. Add the path to the downloaded executable to your PATH environment variable
          4. Open Git Bash or the Cygwin console (since the shell script has to be to run in a Linux-like environment)
          5. Proceed with the steps in the next section
      
          *[Generating the sources]*
          1. On your console (Git Bash or Cygwin console for Windows users) navigate to the `kyosk-dataproducts` root directory
          2. Write the command `bin/scripts/commands -o {OS} -w {squad directory} -g java` and press ENTER
          
          [Example 1]: To generate sources for *ibs* squad using a Linux OS: `bin/scripts/commands -o linux -w ibs -g java`
      
          [Example 2]: To generate sources for *payments* squad using Windows: `bin/scripts/commands -o windows -w payments -g java`

        - **Java**
            - **Directory Structure**
                
                Within the java project under `$Root/<*squad*>/gen/java-src` ****there will be 2 submodules
                
                - data - this is for the dataProducts to be shared with other teams
                - testData - this is test server and test client interfaces
            - **Artifact Generation (.jar)**
                
                Artifacts gereated are without the gRPC and proto libraries and it is expected that whoever imports the artifacts into their project will import these. This is to allow us to maintain small artifact sizes for storage in our registry but also for a project that needs multiple data products not to have to import each *shared* dependency multiple times
                
                  **- Versioning** 
                
                Version is set using NEW_VERSION environment variable. we use *semvers* to set our version numbers. in CI to continuously bump up the version number we pull the version file from gcs. Each squad maintains their own [file](https://console.cloud.google.com/storage/browser/ky_github_actions;tab=objects?forceOnBucketsSortingFiltering=false&project=kyosk-prod&prefix=&forceOnObjectsSortingFiltering=false). Whatever is in the file is bumped up by the patch number. 
                
                - **Snapshots**
                    
                    For snapshots we do not bump up the version number. This is particularly useful when in development stage and you do not necessarily want to create a lot of versions. This is because unlike relaese repos you can overwrite snapshot artifacts
                    
                - **Release**
                    
                    Release repositories do not allow artifacts to be overwritten. This should always be used for artifacts that end up in production
                    
                
                     
                
            - **Artifact Publishing**
                
                Artifacts are published to [gcp artifact registr](https://console.cloud.google.com/artifacts?project=kyosk-prod)y using maven-publish plugin as well as a gcp artifact plugin. The plugin looks in the build environment for APPLICATION_DEFAULT_CREDENTIALS variable or an authenticated gcloud instance and uses those credentials to publish the artifact. For those with @kyosk.app emails if you have gcloud installed and logged in this should work automatically 
                
- CI/CD
    
    For CI/CD we perform a lint check, backwards compatibility check and BSR (buf schema registry ) push on every PR created. if this fail the change cannot be merged into master
    
    Upon merge to master we run a job to generate the java sources and publish the artifacts to gcp artifact registry
    
    PR checks and builds are only done on directories kindly contact @data-team incase you need your repo added
