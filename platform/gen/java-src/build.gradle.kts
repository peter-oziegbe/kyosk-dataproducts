import java.util.LinkedList

plugins {
    java
    application
    `maven-publish`
    id("com.google.cloud.artifactregistry.gradle-plugin") version "2.1.5"
}



allprojects {
    repositories {
        mavenCentral()
        maven("artifactregistry://europe-west4-maven.pkg.dev/kyosk-prod/kyosk-maven-release")
    }

}

subprojects{

    apply(plugin =  "application")
    apply(plugin =  "java-library")
    apply(plugin = "maven-publish")
    apply(plugin = "com.google.cloud.artifactregistry.gradle-plugin")


    group = "app.kyosk.data-products.platform"
    version =System.getenv("NEW_VERSION")


    dependencies{
        compileOnly("com.google.protobuf:protobuf-java:3.21.6")
        compileOnly("io.grpc:grpc-all:1.49.1")
        compileOnly("javax.annotation:javax.annotation-api:1.3.2")
        testImplementation("org.junit.jupiter:junit-jupiter-api:5.6.0")
        testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
    }

    publishing {
        publications {
            create<MavenPublication>("maven"){
                from(components["java"])
            }
        }
        repositories {
            maven {
                val snapshotURL = "artifactregistry://europe-west4-maven.pkg.dev/kyosk-prod/kyosk-maven-snapshot"
                val releaseURL = "artifactregistry://europe-west4-maven.pkg.dev/kyosk-prod/kyosk-maven-release"
                url =  uri(if (version.toString().endsWith("SNAPSHOT")) snapshotURL else releaseURL)
            }
        }
    }

    tasks.getByName<Test>("test") {
        useJUnitPlatform()
    }
}
